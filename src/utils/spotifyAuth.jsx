// src/utils/spotifyAuth.jsx

export async function spotifyAuth() {
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

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

  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const clientId = "9aca5eb2ded04c25ba99b94528eb7549";
  const redirectUri = "http://127.0.0.1:5173"; // <-- Make sure this matches your Spotify app settings

  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-read-private playlist-modify-public";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  window.localStorage.setItem("code_verifier", codeVerifier);

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
  console.log(redirectUri);
}

// Call this after redirect, if code is present in URL
export async function getTokenFromCode() {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  if (!code) return;

  const clientId = "9aca5eb2ded04c25ba99b94528eb7549";
  const redirectUri = "http://127.0.0.1:5173"; // <-- Must match above
  const codeVerifier = localStorage.getItem("code_verifier");

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
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
    localStorage.setItem("access_token", response.access_token);
  } else {
    console.error("Failed to get access token:", response);
  }
}
