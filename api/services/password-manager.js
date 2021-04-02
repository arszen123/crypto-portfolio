"use strict";

const crypto = require('crypto');

class PasswordManagerService {
    constructor(salt) {
        this._salt = salt;
    }

    hash(password, salt) {
        return crypto.pbkdf2Sync(password, (salt || this._salt), 1000, 64, 'sha512').toString('hex');
    }

    validate(password, hashedPassword, salt) {
        return this.hash(password, salt) === hashedPassword;
    }
}

module.exports = PasswordManagerService;