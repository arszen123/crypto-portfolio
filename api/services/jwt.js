"use strict";

const jwt = require('jsonwebtoken');

class JwtService {
    constructor(secret, signOptions) {
        this._secret = secret;
        this._options = signOptions;
    }
    sign(payload) {
        return jwt.sign(payload, this._secret, this._options);
    }
    verify(token) {
        return jwt.verify(token, this._secret);
    }
    decode(token) {
        return jwt.decode(token, this._secret);
    }
}

module.exports = JwtService;