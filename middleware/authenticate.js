const crypto = require('crypto');

// Checks if authenticated
function authenticate(req, res, next) {
    if(!req.session || !req.session.clientId){
        const err = new Error('You shall not pass');
        err.statusCode = 401;
        next(err);
    }
    next();
}

// Generating code verifier
function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Generetaing code challenge
function generateCodeChallenge(codeVerifier) {
    const hashedVerifier = crypto
        .createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return hashedVerifier;
}

module.exports = {generateCodeChallenge, generateCodeVerifier, authenticate}