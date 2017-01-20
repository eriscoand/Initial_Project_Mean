'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
var configJWT = require('../config').jwt;

/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {function} Express 4 middleware
 */
module.exports = function() {

    return function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, configJWT.secret, function(err, decoded) {
                if (err) {
                    return next({error: req.lang_e.TOKEN_FAILED, detail: err });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token return error
            return next({error: req.lang_e.NO_TOKEN});

        }
    };
};