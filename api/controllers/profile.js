"use strict";

const router = require('express').Router();
const passport = require('passport');
const authGuard = passport.authenticate('bearer', { session: false })

module.exports = function (context) {

    router.get(
        '/exchanges/sync-balances',
        authGuard,
        async function (req, res) {
            const exchanges = await context.get('users').getExchanges(req.user.id);
            const balances = await context.get('exchanges').getBalanceFromExchanges(decryptCredentials(req.user.apiEncodingKey, exchanges));
            for (let i = 0; i < exchanges.length; i++) {
                exchanges[i].assets = balances[i];
            }
            await context.get('users').updateExchanges(req.user.id, exchanges);
            res.json({success: true});
        }
    );

    router.get(
        '/exchanges',
        authGuard,
        async function (req, res) {
            const exchanges = await context.get('users').getExchanges(req.user.id);
            res.json(decryptCredentials(req.user.apiEncodingKey, exchanges));
        }
    );

    router.post(
        '/exchanges',
        authGuard,
        async function (req, res) {
            const createExchangeDto = req.body || {};
            const result = { success: true };
            if (!(await _testCredentials(res, createExchangeDto))) {
                return;
            }
            try {
                const insertedId = await context.get('users').addExchange(req.user.id, encryptCredentials(req.user.apiEncodingKey, createExchangeDto));
                result.id = insertedId;
            } catch (e) {
                res.json({
                    success: false,
                    message: 'Error',
                });
                return;
            }
            res.json(result);
        }
    )

    router.put(
        '/exchanges/:id',
        authGuard,
        async function (req, res) {
            const createExchangeDto = req.body || {};
            if (!(await _testCredentials(res, createExchangeDto))) {
                return;
            }
            try {
                await context.get('users').updateExchange(req.user.id, req.params.id, encryptCredentials(req.user.apiEncodingKey, createExchangeDto));
            } catch (e) {
                res.json({
                    success: false,
                    message: 'Error',
                });
                return;
            }
            res.json({
                success: true,
            })
        })

    router.delete(
        '/exchanges/:id',
        authGuard,
        async function (req, res) {
            try {
                await context.get('users').deleteExchange(req.user.id, req.params.id);
            } catch (e) {
                res.json({
                    success: false,
                    message: 'Error',
                });
                return;
            }
            res.json({
                success: true,
            })
        }
    )

    async function _testCredentials(res, exchange) {
        try {
            await context.get('exchanges').testCredentials(exchange);
        } catch (e) {
            res.json({
                success: false,
                message: e.message,
            });
            return false;
        }
        return true;
    }
    return router;

    function decryptCredentials(apiEncodingKey, exchanges) {
        return encryptOrDecryptCredentials(apiEncodingKey, exchanges, false);
    }

    function encryptCredentials(apiEncodingKey, exchanges) {
        return encryptOrDecryptCredentials(apiEncodingKey, exchanges, true);
    }

    function encryptOrDecryptCredentials(apiEncodingKey, exchanges, isEncrypt) {
        let taskFn = (credential) => context.get('crypto').decrypt(credential, apiEncodingKey);
        if (isEncrypt) {
            taskFn = (credential) => context.get('crypto').encrypt(credential, apiEncodingKey);
        }
        const isArray = Array.isArray(exchanges);
        exchanges = isArray ? exchanges : [exchanges];
        const res = [];
        for (const exchange of exchanges) {
            const credentials = context.get('exchanges').getExchangeCredentialsByKey(exchange.key);
            const tmpObj = {...exchange};
            for (const credential of credentials) {
                tmpObj[credential] = taskFn(exchange[credential]);
            }
            res.push(tmpObj);
        }
        if (isArray) {
            return res;
        }
        return res.pop();
    }
}