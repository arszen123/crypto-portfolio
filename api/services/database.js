"use strict";

const mongodb = require('mongodb');

class DatabaseService {
    constructor(uri, databaseName, options) {
        this.uri = uri;
        this.databaseName = databaseName;
        this.options = options;
        this._connection = null;
    }
    async executeTransaction(cb) {
        const conn = await mongodb.connect(this.uri, this.options || {});
        if (typeof cb !== 'function') {
            cb = (db, conn) => {};
        }
        try {
            cb.call(undefined, conn.db(this.databaseName), conn);
        } finally {
            conn.close();
        }
    }

    async open() {
        if (this._connection === null) {
            this._connection = await mongodb.connect(this.uri, this.options || {});
        }
    }

    async close() {
        this._assertHasOpenConnection();
        this._connection.close();
        this._connection = null;
    }

    get connection() {
        this._assertHasOpenConnection();
        return this._connection;
    }

    get db() {
        return this.connection.db(this.databaseName);
    }
    _assertHasOpenConnection() {
        if (this._connection === null) {
            throw new Error('No open connection!');
        }
    }
}

module.exports = DatabaseService;