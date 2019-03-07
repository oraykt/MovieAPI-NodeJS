const express = require('express');
const router = express.Router();
// Models 
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
  const promise = Movie.find({});
  promise.then((movie) => {
    res.json({ statusCode: res.statusCode, movie });
  }).catch((err) => {
    console.error(err);
    res.send(err.message);
  });
});

router.get("/:movie_id", (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    res.json({ statusCode: res.statusCode, movie });
  }).catch((err) => {
    if (err.name === "CastError") {
      next({ message: "The movie was not found!" });
    } else {
      console.error(err);
      res.send("Unexpected Error!");
    }
  })
});

router.post('/', (req, res, next) => {
  //const { title, category, country, year, imdb_score, director_id } = req.body;
  const promise = new Movie(req.body).save();
  promise.then((movie) => {
    res.json({ statusCode: res.statusCode, added: movie });
  }).catch((err) => {
    console.error(err);
    res.send(err.message);
  });
});

router.put("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, req.body, { new: true }
  );
  promise.then((movie) => {
    res.json({ statusCode: res.statusCode, updated: movie });
  }).catch((err) => {
    if (err.name === "CastError") {
      next({ message: "The movie was not found!" });
    } else {
      console.error(err);
      res.send("Unexpected Error!");
    }
  })
});
module.exports = router;
