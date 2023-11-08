const express = require('express');
const router = express.Router();
const axios = require('axios');
const queryString = require("node:querystring");
const { setToSession, getFromSession} = require('../helperFunction'); // Replace './your-session-file' with the actual path to the file containing the functions

router.get('/api/authorization', async (req, res) => {
    var scope = [
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "user-follow-read",
        "user-top-read",
        "user-read-recently-played",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-read-playback-state",
        "user-modify-playback-state",
        "ugc-image-upload",
      ].join(" ");
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
      }));
});

router.get("/api/account", async (req,res) => {
    // COMING BACK FROM SPOTIFY PAGE TO FIND OUT MY SESSION ID HAS CHANGED
    try{
        const spotifyResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            queryString.stringify({
                grant_type: "authorization_code",
                code : req.query.code,
                redirect_uri: process.env.REDIRECT_URI,
                client_id: process.env.CLIENT_ID,
            }),
            {
                headers: {
                    Authorization: 'Basic ' + btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        if(spotifyResponse.status === 200){
            access_token = spotifyResponse.data.access_token;
            refresh_token = spotifyResponse.data.refresh_token;
           
            const sessionData = {
                access_token: access_token,
                refresh_token: refresh_token
            };
            const result = await setToSession(req, sessionData);
            if(result === false){
                console.log("Error saving tokens");
            }
            
            res.redirect(`${process.env.CLIENT_URL}/top-lists`);
        } else{
            console.log("Problem with fetching access token");
        }
    } catch(error){
        console.error("Acces token fetch failed: ", error);
    }
});


// CHECKING FOR ACCESS TOKEN IN SESSION

router.get("/api/check-access-token", async (req, res) => {
    const access_token = await getFromSession(req, 'access_token');
    if(access_token){
        res.json({ isAccessTokenPresent : true});
    }
    else{
        res.json({ isAccessTokenPresent : false});
    }
});



module.exports = router;