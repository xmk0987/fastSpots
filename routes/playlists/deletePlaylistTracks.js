const express = require('express');
const axios = require('axios');
const router = express.Router();
const bodyParser = require('body-parser');
const { getFromSession } = require('../../helperFunction'); 

router.use(bodyParser.json());

router.delete("/api/deleteTracks/:playlistId", async (req, res) => {
    const access_token = await getFromSession(req, "access_token");
    if (!access_token) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }
    try {
        const playlistId = req.params.playlistId;
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        const headers = {
            "Authorization": 'Bearer ' + access_token,
            'Content-Type': 'application/json'
        };
        const body = {
            tracks: req.body.tracks,
        };

        const response = await axios.delete(url, {
            headers,
            data: body
        });

        if (response.status === 200) {
            res.status(200).json({ message: 'Tracks deleted', playlist: response.data });
        } else {
            console.error('Failed to delete tracks');
            res.status(response.status).json({ error: 'Failed to delete tracks' });
        }
    } catch (error) {
        console.error("Error deleting tracks:", error);
        res.status(400).json({ error: "Error deleting tracks" });
    }
});

module.exports = router;
