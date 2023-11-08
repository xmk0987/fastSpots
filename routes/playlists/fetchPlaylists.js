const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction');


const router = express.Router();

router.get('/api/fetchPlaylists', async (req, res) => {
  const access_token = await getFromSession(req, "access_token");
  if (!access_token) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
  try {
    const response = await fetchUserPlaylists(access_token);

    if (response.status === 200) {
      const data = response.data;
      res.json(data);
    } else {
      console.error('Failed to fetch playlists - Spotify API returned an error.');
      res.status(response.status).json({ error: 'Failed to fetch playlists' });
    }
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// A function to fetch user playlists from Spotify
async function fetchUserPlaylists(accessToken) {
  return axios.get('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
}

module.exports = router;
