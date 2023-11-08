const axios = require('axios');


const refreshToken = async (req, res) => {
    try {
        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const refresh_token = req.session.refresh_token;
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
                client_id: client_id
            }
        };

        const response = await axios.post(authOptions.url, authOptions.data, {
            headers: authOptions.headers
        });

        if (response.status === 200) {
            if (response.data.access_token) {
                const access_token = response.data.access_token;
                req.session.access_token = access_token;
            }

            if (response.data.refresh_token) {
                const refresh_token = response.data.refresh_token;
                req.session.refresh_token = refresh_token;
            }

            console.log("Access token refreshed");
        } else {
            console.log("Token refresh failed");
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
    }
};


module.exports = refreshToken;