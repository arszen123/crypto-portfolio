"use strict";

const app = require('express')();
const port = 8080;

const auth = require('./controllers/auth');
const exchanges = require('./controllers/exchanges');
const profile = require('./controllers/profile');
const UsersService = require('./services/users');
const DatabaseService = require('./services/database');
const JwtService = require('./services/jwt');
const PasswordManagerService = require('./services/password-manager');
const ExchangesService = require('./services/exchanges');
const { ServiceContext } = require('./utils/context');
const bodyParser = require('body-parser');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer');
const cors = require('cors');

/**
 * Context setup
 */

const context = new ServiceContext({
    'password-manager': () => new PasswordManagerService(process.env.PASSWORD_SALT),
    jwt: () => new JwtService(process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }),
    db: () => new DatabaseService(process.env.DB_URI, 'portfolio', {
        authSource: 'admin',
        auth: {
            user: process.env.DB_AUTH_USER,
            password: process.env.DB_AUTH_PASS,
        }
    }),
    users: function () {
        return new UsersService(this.get('db'), this.get('password-manager'))
    },
    exchanges: () => new ExchangesService(),
});

/**
 * Passport setup
 */

passport.use(new BearerStrategy(
    function (token, done) {
        try {
            const data = context.get('jwt').verify(token);
            return done(null, data);
        } catch (e) {
        }
        return done(null, false);
    }
))

/**
 * App setup
 */
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    await context.get('db').open();
    next();
});

app.use('/auth', auth(context));
app.use('/exchanges', exchanges(context));
app.use('/profile', profile(context));

app.use(async (req, res, next) => {
    await context.get('db').close();
    next();
});

app.listen(port, () => {
    // setup
    context.get('db').executeTransaction( db => {
        db.collection('users').createIndex({username: 1}, {unique: true})
    });
    console.log(`Application listening at http://localhost:${port}.`);
});