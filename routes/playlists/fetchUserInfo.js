const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction');

const router = express.Router();


router.get("/api/fetchUser", async (req, res) => {
    const access_token = await getFromSession(req, "access_token");
    if (!access_token) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }
    try {
        const response = await axios.get(
            "https://api.spotify.com/v1/me",
            {
                headers: {
                    Authorization: "Bearer " + access_token,
                },
            }
        );

        if (response.status === 200) {
            const data = await response.data;
            res.json(data);
        } else {
            console.error("Failed to fetch user - Spotify API returned an error.");
            res.status(response.status).json({ error: "Failed to fetch user" });
        }
        
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;
