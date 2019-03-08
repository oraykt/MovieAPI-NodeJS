const express = require('express');
const router = express.Router();

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
    promise.then((director) => {
        res.json(director);
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

module.exports = router;