"use strict";

const crypto = require('crypto');
const IV = "5183666c72eec9e4";

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

    encrypt(text, key) {
        const algorithm = 'aes-256-ctr';
        const cipher = crypto.createCipheriv(algorithm, key, IV)
        const crypted = cipher.update(text, 'utf8', 'hex');
        return crypted + cipher.final('hex');
    }

    decrypt(text, key) {
        const algorithm = 'aes-256-ctr';
        const decipher = crypto.createCipheriv(algorithm, key, IV)
        const dec = decipher.update(text, 'hex', 'utf8')
        return dec + decipher.final('utf8');
    }
}

module.exports = PasswordManagerService;