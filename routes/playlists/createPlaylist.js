const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction'); 

const router = express.Router();

router.get('/api/createPlaylist/:userId/:name/:description/:publicState', async (req, res) => {
    const access_token = await getFromSession(req, "access_token");
    if (!access_token) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }
    
    const userId = req.params.userId;
    const name = req.params.name;
    const description = req.params.description;
    const publicState = JSON.parse(req.params.publicState);
    
    try {
        const url = `https://api.spotify.com/v1/users/${userId}/playlists`;

        const data = {
            name: name,
            description: description,
            public: publicState,
        };

        const headers = {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json',
        };

        const response = await createPlaylistOnSpotify(url, data, headers);

        if (response.status === 201) {
            res.status(201).json({ message: 'Playlist created', playlist: response.data });
        } else {
            console.error('Failed to create the playlist - Spotify API returned an error.');
            res.status(response.status).json({ error: 'Failed to create the playlist' });
        }
    } catch (error) {
        console.error('Error creating the playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

// A function to create a playlist on Spotify with proper error handling
async function createPlaylistOnSpotify(url, data, headers) {
    try {
        return await axios.post(url, data, { headers });
    } catch (error) {
        console.error('Error while creating the playlist on Spotify:', error);
        return { status: 500 }; // Return a status code indicating an error
    }
}

module.exports = router;



