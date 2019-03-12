const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Director = require('../models/Director');

router.get('/', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        }, {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        }, {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        }, {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((directors) => {
        res.json(directors);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/:director_id', (req, res, next) => {
    const promise = Director.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((directors) => {
        res.json(directors[0]);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/', (req, res) => {
    const director = new Director(req.body);
    const promise = new Director(req.body).save();
    promise.then((director) => {
        res.json(director);
    }).catch((error) => {
        res.json(error);
    });
});

router.put("/:director_id", (req, res, next) => {
    const promise = Director.findByIdAndUpdate(
        req.params.director_id, req.body, { new: true }
    );
    promise.then((director) => {
        if (director) {
            res.json({ statusCode: res.statusCode, updated: director });
        } else {
            next({ statusCode: res.statusCode, message: "The director was not found!" });
        }
    }).catch((err) => {
        console.error(err);
        next({ statusCode: res.statusCode, message: err.message });
    });
});

router.delete("/:director_id", (req, res, next) => {
    const promise = Director.findByIdAndDelete(req.params.director_id);
    promise.then((director) => {
        if (director)
            res.json({ statusCode: res.statusCode, deleted: true });
        else {
            next({ statusCode: res.statusCode, message: "The director was not found!" });
        }
    }).catch((err) => {
        console.error(err);
        next({ statusCode: res.statusCode, message: "The director was not found!" });
    });
});
module.exports = router;