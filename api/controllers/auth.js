"use strict";

const router = require('express').Router();
const ajv = new (require("ajv").default)();

const CreateUserDTOSchema = {
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" }
    },
    required: ["username", "password"],
    additionalProperties: false
};

const SignInDataSchema = CreateUserDTOSchema;

function _validateSchemaData(schema, data) {
    const validator = ajv.compile(schema);
    if (!validator(data)) {
        return false;
    }
    return true;
}

module.exports = function (context) {
    router.all('/sign-in', async function (req, res) {
        const signInData = req.body || {};
        if (!_validateSchemaData(SignInDataSchema, signInData)) {
            res.json({
                success: false,
                message: 'Invalid schema!',
            })
            return;
        }
        const user = await context.get('users').findByUsername(signInData.username);
        if (user && context.get('password-manager').validate(signInData.password, user.password)) {
            const apiEncodingKey = context.get('crypto').generateKey(user.password);
            const token = context.get('jwt').sign({id: user._id.toString(), username: user.username, apiEncodingKey});
            res.json({
                success: true,
                token,
            })
            return;
        }
        res.json({
            success: false,
            message: 'Invalid login credentials',
        })
    });

    router.all('/sign-up', async function (req, res) {
        const createUserDto = req.body || {};
        if (!_validateSchemaData(CreateUserDTOSchema, createUserDto)) {
            res.json({
                success: false,
                message: 'Invalid schema!',
            })
            return;
        }

        const response = {
            success: true,
        }
        try {
            const user = await context.get('users').create(createUserDto);
            const apiEncodingKey = context.get('crypto').generateKey(createUserDto.password);
            response.token = context.get('jwt').sign({id: user.insertedId, username: createUserDto.username, apiEncodingKey});
        } catch (e) {
            response.success = false;
            response.message = 'Error';
            if (e.code === 11000) {
                response.message = 'Username already taken!';
            }
        }
        res.json(response);
    });
    return router;
}