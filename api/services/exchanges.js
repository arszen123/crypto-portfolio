"use strict";

const cctx = require('ccxt');

class ExchangesService {
    getExchanges() {
        const exchangesKey = cctx.exchanges;
        const res = [];
        for (const key of exchangesKey) {
            const exchangeInstance = new cctx[key]();
            if (exchangeInstance.has['fetchBalance']) {
                const requiredCredentials = this._getExchangeCredentialsByExchange(exchangeInstance);
                res.push({
                    key,
                    requiredCredentials,
                    name: exchangeInstance.name,
                    logo: exchangeInstance.urls.logo,
                    site: exchangeInstance.urls.www,
                });
            }
        }
        return res;
    }

    async getBalanceFromExchanges(exchanges) {
        const fetches = [];
        for (const exchangeData of exchanges) {
            const {key, ...credentials} = exchangeData;
            fetches.push(this.getExchangeBalance(key, credentials));
        }
        const result = await Promise.allSettled(fetches);
        return result.map(res => res.status === 'fulfilled' ? res.value : {});
    }
    
    /**
     * Return spot account balances, which are greater than zero.
     */
    async getExchangeBalance(key, credentials) {
        this._assertExchangeAvailable(key);
        const exchange = new cctx[key](credentials);
        exchange.checkRequiredCredentials();
        const balances = (await exchange.fetchBalance()).total;
        const result = {};
        for (const assetKey in balances) {
            const balance = balances[assetKey];
            if (balance > 0) {
                const normalizedKey = this._normalizeAssetKey(key, assetKey);
                result[normalizedKey] = balance;
            }
        }
        return result;
    }
    _assertExchangeAvailable(key) {
        const exchange = cctx[key];
        if (!exchange || !(new exchange()).has['fetchBalance']) {
            throw new Error('Exchange not found!');
        }
    }
    /**
     * Tests whether the credentials valid and has the required roles or not.
     */
    async testCredentials(exchange) {
        const {key, ...credentials} = exchange;
        try {
            this._assertExchangeAvailable(key);
            const exchange = new cctx[key](credentials);
            exchange.checkRequiredCredentials();
            (await exchange.fetchBalance())
        } catch (e) {
            throw Error('Invalid credentials! Please check if it is valid and has the right roles.');
        }
    }

    getExchangeCredentialsByKey(key) {
        this._assertExchangeAvailable(key);
        const exchange = new cctx[key]();
        return this._getExchangeCredentialsByExchange(exchange);
    }
    
    _getExchangeCredentialsByExchange(exchange) {
        const res = [];
        for (const credentialKey in exchange.requiredCredentials) {
            if (exchange.requiredCredentials[credentialKey]) {
                res.push(credentialKey);
            }
        }
        return res;
    }

    /**
     * On different exchanges you can stake/provide liquidity,
     * and these tokens got different prefixes/postfixes.
     * 
     * @param {string} exchangeKey
     * @param {string} assetKey
     */
    _normalizeAssetKey(exchangeKey, assetKey) {
        if (exchangeKey === 'kraken') {
            return assetKey.split('.')[0];
        }
        if (exchangeKey === 'binance') {
            if (assetKey.slice(0,2) === 'LD' && assetKey.length > 2) {
                return assetKey.slice(2);
            }
            return assetKey;
        }
        return assetKey;
    }
}

module.exports = ExchangesService;