const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.body.token;
    if (token) {
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            if (!err) {
                req.decode = decoded;
                next();
            } else {
                next({
                    status: false,
                    message: 'Failed to authenticate token.'
                });
            }
        })
    } else {
        next({
            status: 401,
            message: 'No token provided.'
        })
    }
};