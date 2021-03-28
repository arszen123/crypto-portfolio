"use strict";

const router = require('express').Router();

module.exports = function (context) {
    router.get('/', async function (req, res) {
        const exchanges = context.get('exchanges').getExchanges();
        res.json(exchanges);
    });
    return router;
}