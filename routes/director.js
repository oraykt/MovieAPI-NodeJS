const express = require('express');
const router = express.Router();

const Director = require('../models/Director');

router.post('/', (req, res, next) => {
    const director = new Director(req.body);
    const promise = new Director(req.body).save();
    promise.then((director) => {
        res.json(director);
    }).catch((error) => {
        res.json(error);
    });
});

module.exports = router;