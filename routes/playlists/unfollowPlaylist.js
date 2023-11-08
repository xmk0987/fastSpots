const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction');


const router = express.Router();

router.delete('/api/unfollowPlaylist/:playlistId', async (req, res) => {
    const access_token = await getFromSession(req, "access_token");
    if (!access_token) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }
    const playlistId = req.params.playlistId;
    try {
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        const response = await axios.delete(url, { headers });

        if (response.status === 200) {
            res.status(200).json({ message: 'Playlist unfollowed' });
        } else {
            console.error('Failed to unfollow');
            res.status(response.status).json({ error: 'Failed to unfollow' });
        }
    } catch (error) {
        console.error('Failed to unfollow:', error);
        res.status(500).json({ error: 'Failed to unfollow' });
    }
});

module.exports = router;
