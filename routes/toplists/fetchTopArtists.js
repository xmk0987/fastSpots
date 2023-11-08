// FETCHING TOP ARTISTS
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getFromSession } = require('../../helperFunction'); 


router.get("/api/top-artists/:limit", async (req, res) => {
  const access_token = await getFromSession(req, "access_token");
  if (!access_token) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }

  const limit = req.params.limit;
  try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/artists?limit=${limit}`,
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
  
      if(response.status === 200){
        const data = await response.data;
        res.json(data);
      }
    
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
  
});

module.exports = router;