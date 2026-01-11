const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

// Check if token is expired
const isTokenExpired = () => {
  const expiration = localStorage.getItem("token_expiration");
  return !expiration || new Date().getTime() > parseInt(expiration);
};

// Start the Spotify authentication flow
export async function spotifyAuth() {
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const codeVerifier = generateRandomString(64);
  localStorage.setItem("code_verifier", codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const scope = [
    "user-read-private",
    "user-read-email",
    "playlist-modify-private",
    "playlist-read-private",
    "playlist-modify-public",
  ].join(" ");

  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

// Exchange authorization code for access token
export async function getTokenFromCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if (!code) return;

  const codeVerifier = localStorage.getItem("code_verifier");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  if (response.access_token) {
    const expiresInMs = response.expires_in * 1000;
    const expirationTime = new Date().getTime() + expiresInMs;
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("token_expiration", expirationTime);

    // Clean up URL
    window.history.replaceState({}, document.title, "/");
  } else {
    console.error("Failed to get access token:", response);
  }
}

// Get the current access token, or restart auth if expired
export function getAccessToken() {
  if (isTokenExpired()) {
    return null;
  }
  return localStorage.getItem("access_token");
}

// Clear all auth data
export function clearAuthData() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("code_verifier");
  localStorage.removeItem("token_expiration");
  window.location.href = "/";
}
