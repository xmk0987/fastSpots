const express = require('express');
const router = express.Router();
const axios = require('axios');
const queryString = require("node:querystring");
const authenticateFunctions = require('../middleware/authenticate');
const { setToSession, getFromSession} = require('../helperFunction');


router.get('/api/authorization', async (req, res) => {
    const verifier = authenticateFunctions.generateCodeVerifier(128);
    const challenge = authenticateFunctions.generateCodeChallenge(verifier);

    const verifierObject = {
        verifier: verifier
    }
    const result = await setToSession(req, verifierObject);
    if(result === false){
        console.log("Error saving verifier");
    }
    console.log("verifier saved" + req.session.myData.verifier);    
    console.log(req.sessionID);


    const scope = [
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
    const scopeURL = "&scope=" + encodeURIComponent(scope);
    let url = "https://accounts.spotify.com/authorize";
    url += "?client_id=" + encodeURIComponent(process.env.CLIENT_ID);
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURIComponent(`${process.env.REDIRECT_URI}`);
    url += scopeURL;
    url += "&code_challenge_method=S256";
    url += "&code_challenge=" + challenge;
    res.redirect(url);
});

router.get("/api/account", async (req,res) => {

    try{
        const verifier = await getFromSession(req, "verifier");
        console.log("in account " + verifier);
        console.log(req.sessionID);

        const spotifyResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            queryString.stringify({
                grant_type: "authorization_code",
                code : req.query.code,
                redirect_uri: process.env.REDIRECT_URI,
                client_id: process.env.CLIENT_ID,
                code_verifier: verifier,
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
            const cookie = req.cookies['fast-spots-cookie'];

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
    console.log("checking access");
    const access_token = await getFromSession(req, 'access_token');
    if(access_token){
        res.json({ isAccessTokenPresent : true});
    }
    else{
        res.json({ isAccessTokenPresent : false});
    }
});

module.exports = router;