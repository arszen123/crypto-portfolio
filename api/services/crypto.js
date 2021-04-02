"use strict";

const crypto = require('crypto');

/**
 * Used to encode/decode api credentials.
 */
class CryptoService {

    constructor(salt, IV) {
        this._algorith = 'aes-256-cbc';
        this._salt = salt;
        this._IV = IV;
    }

    generateKey(text) {
        return crypto.pbkdf2Sync(text, this._salt, 100000, 256/8, 'sha256').toString('base64');
    }

    encrypt(text, key) {
        key = Buffer.from(key, 'base64');
        const cipher = crypto.createCipheriv(this._algorith, key, this._IV)
        const crypted = cipher.update(text, 'utf8', 'hex');
        return crypted + cipher.final('hex');
    }

    decrypt(text, key) {
        key = Buffer.from(key, 'base64');
        const decipher = crypto.createDecipheriv(this._algorith, key, this._IV)
        const dec = decipher.update(text, 'hex', 'utf8')
        return dec + decipher.final('utf8');
    }
}

module.exports = CryptoService;