const express = require('express');
const router = express.Router();

router.get('/api/logout', async (req, res) => {
  // Destroy the user's session and clear the session cookie.
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      console.log('User session has been destroyed.');
      res.clearCookie('fast-spots-cookie');
      res.status(200).send('Logout successful');
    }
  });
});

module.exports = router;