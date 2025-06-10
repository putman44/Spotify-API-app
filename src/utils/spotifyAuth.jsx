// src/utils/spotifyAuth.jsx

// Function to start the Spotify authentication flow
export async function spotifyAuth() {
  // Helper to generate a random string for PKCE code verifier
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  // Generate a code verifier for PKCE
  const codeVerifier = generateRandomString(64);

  // Helper to hash the code verifier using SHA-256
  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  // Helper to base64-url encode the hash
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  // Hash the code verifier and encode it for the code challenge
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Your Spotify app's client ID
  const clientId = "9aca5eb2ded04c25ba99b94528eb7549";
  // The redirect URI registered in your Spotify app settings
  const redirectUri = "http://localhost:5173"; // <-- Make sure this matches your Spotify app settings

  // The scopes your app is requesting
  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-read-private playlist-modify-public";
  // The Spotify authorization endpoint
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // Store the code verifier in localStorage for later use
  window.localStorage.setItem("code_verifier", codeVerifier);

  // Build the authorization request parameters
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  // Set the search params on the auth URL
  authUrl.search = new URLSearchParams(params).toString();
  // Redirect the user to the Spotify login/authorization page
  window.location.href = authUrl.toString();
}

// Function to exchange the authorization code for an access token
// Call this after redirect, if code is present in URL
export async function getTokenFromCode() {
  // Parse the code from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  if (!code) return; // If no code, do nothing

  // Your Spotify app's client ID
  const clientId = "9aca5eb2ded04c25ba99b94528eb7549";
  // The redirect URI registered in your Spotify app settings
  const redirectUri = "http://localhost:5173"; // <-- Must match above
  // Retrieve the code verifier from localStorage
  const codeVerifier = localStorage.getItem("code_verifier");

  // Spotify's token endpoint
  const url = "https://accounts.spotify.com/api/token";
  // Build the POST request payload
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

  // Send the POST request to exchange code for access token
  const body = await fetch(url, payload);
  const response = await body.json();

  // If successful, store the access token in localStorage
  if (response.access_token) {
    localStorage.setItem("access_token", response.access_token);
  } else {
    // Log error if token exchange fails
    console.error("Failed to get access token:", response);
  }
}
