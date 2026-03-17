import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.static("public")); // Serve HTML & CSS

// Replace with your Spotify Developer app credentials
const clientId = "YOUR_CLIENT_ID";
const clientSecret = "YOUR_CLIENT_SECRET";

// Spotify token endpoint
let accessToken = "";
let tokenExpires = 0;

// Function to get token
async function getToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpires) return accessToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpires = now + data.expires_in * 1000 - 60000; // Refresh 1 min early
  return accessToken;
}

// Search endpoint
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ tracks: [] });

  const token = await getToken();
  const result = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
    { headers: { Authorization: "Bearer " + token } }
  );
  const data = await result.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));