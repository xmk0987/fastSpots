// FETCHING TOP ARTISTS
const express = require('express');
const router = express.Router();


router.get("/api/logout", async (req, res) => {
    delete req.session.myData
    req.session.destroy();
    res.clearCookie('fast-spots-cookie');
    res.redirect(`${process.env.CLIENT_URL}/login`);
    console.log("logged out");
});

module.exports = router;