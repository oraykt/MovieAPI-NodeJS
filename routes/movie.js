const express = require('express');
const router = express.Router();
// Models 
const Movie = require('../models/Movie');

router.get('/', (req, res) => {

  const promise = Movie.find({});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    console.error(err);
    res.send("Unexpected Error!");
  });
});

router.post('/', (req, res, next) => {
  //const { title, category, country, year, imdb_score, director_id } = req.body;
  const promise = new Movie(req.body).save();
  promise.then((data) => {
    res.json({ status: res.statusCode });
  }).catch((err) => {
    console.error(err);
    res.send("Unexpected Error!");
  });
});

module.exports = router;
