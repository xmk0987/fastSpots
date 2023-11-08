const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction');

const router = express.Router();


router.get("/api/fetchLiked/:offset_value", async (req, res) => {
  const access_token = await getFromSession(req, "access_token");

  if (!access_token) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
  try {
    let offset = 0;
    const limit = 50;
    const allTracks = [];

    while (true) {
      const response = await fetchLikedSongsFromSpotify(access_token, offset, limit);

      if (response.status !== 200) {
        console.error('Failed to fetch liked tracks - Spotify API returned an error.');
        res.status(response.status).json({ error: 'Failed to fetch liked tracks' });
        return;
      }

      const data = response.data;
      const items = data.items;

      if (items.length === 0) {
        break;
      }

      allTracks.push(...items);
      offset += limit;
    }

    cachedLikedSongsData = allTracks;
    res.json(allTracks);
    
  } catch (error) {
    console.error("Error fetching liked tracks:", error);
    res.status(500).json({ error: "Failed to fetch liked tracks" });
  }
});

// A function to fetch liked songs from Spotify with proper error handling
async function fetchLikedSongsFromSpotify(accessToken, offset, limit) {
  try {
    return await axios.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  } catch (error) {
    console.error('Error while fetching liked tracks from Spotify:', error);
    return { status: 500 }; // Return a status code indicating an error
  }
}

module.exports = router;