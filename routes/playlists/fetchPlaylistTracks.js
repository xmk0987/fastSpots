const express = require('express');
const axios = require('axios');
const { getFromSession } = require('../../helperFunction');

const router = express.Router();


router.get(`/api/fetchPlaylistTracks/:playlist_id/:newTracksAdded`, async (req, res) => {
  const access_token = await getFromSession(req, "access_token");

  if (!access_token) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
  const playlistId = req.params.playlist_id;

  try {

    const playlist = await fetchPlaylistTracksFromSpotify(playlistId, access_token);
    res.json(playlist);

  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

// A function to fetch playlist tracks from Spotify
async function fetchPlaylistTracksFromSpotify(playlistId, accessToken) {
  const allTracks = [];
  let next = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const addedTrackIds = new Set();

  while (next) {
    const response = await axios.get(next, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const data = response.data;
    let tracks = data.items;

    tracks.forEach((track) => {
      const trackId = track.track.id;

      if (!addedTrackIds.has(trackId)) {
        allTracks.push(track);
        addedTrackIds.add(trackId);
      }
    });

    next = data.next;
  }

  return allTracks;
}

module.exports = router;