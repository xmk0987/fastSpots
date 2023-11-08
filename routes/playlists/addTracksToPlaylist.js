const express = require('express');
const axios = require('axios');
const router = express.Router();
const bodyParser = require('body-parser');
const { getFromSession } = require('../../helperFunction'); 


router.use(bodyParser.json());

router.post("/api/addTracks/:playlistId", async (req, res) => {
    const access_token = await getFromSession(req, "access_token");
    if (!access_token) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }

    try {
        const playlistId = req.params.playlistId;
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        const uris = req.body.uris;
        const position = req.body.position;

        const body = {
            uris: uris,
            position: position
        };

        const headers = {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        };

        const response = await addTracksToPlaylistOnSpotify(url, body, headers);

        if (response.status === 201) {
            res.status(201).json({ message: 'Tracks added to the playlist', playlist: response.data });
        } else {
            console.error('Failed to add tracks to the playlist - Spotify API returned an error.');
            res.status(response.status).json({ error: 'Failed to add tracks to the playlist' });
        }
    } catch (error) {
        console.error("Failed to add tracks to the playlist:", error);
        res.status(500).json({ error: "Failed to add tracks to the playlist" });
    }
});

// A function to add tracks to a playlist on Spotify with proper error handling
async function addTracksToPlaylistOnSpotify(url, body, headers) {
    try {
        return await axios.post(url, body, { headers });
    } catch (error) {
        console.error('Error while adding tracks to the playlist on Spotify:', error);
        return { status: 500 }; // Return a status code indicating an error
    }
}

module.exports = router;