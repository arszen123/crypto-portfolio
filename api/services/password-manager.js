"use strict";

const crypto = require('crypto');

class PasswordManagerService {
    constructor (salt) {
        this._salt = salt;
    }

    hash(password) {
        return crypto.pbkdf2Sync(password, this._salt, 1000, 64, 'sha512').toString('hex');
    }

    validate (password, hashedPassword) {
        return this.hash(password) === hashedPassword;
    }
}

module.exports = PasswordManagerService;