"use strict";

const { default: axios } = require('axios');

const router = require('express').Router();

const _cache = new Map();
module.exports = function (context) {
    router.get('/', async function (req, res) {
        const symbol = req.query.symbol;
        if (_cache.has(symbol)) {
            const symbolPrice = _cache.get(symbol);
            res.json({price: symbolPrice});
            return;
        }
        try {
            const result = await axios.get('https://www.binance.com/api/v3/avgPrice', {params: {symbol}});
            const price = result.data.price;
            _cache.set(symbol, price);
            res.json({price});
        } catch (e) {
            console.error(e);
            _cache.set(symbol, 0);
            res.json({success: false});
        }
    });
    return router;
}