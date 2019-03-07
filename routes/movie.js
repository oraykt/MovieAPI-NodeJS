const express = require('express');
const router = express.Router();
// Models 
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
  const promise = Movie.find({});
  promise.then((movie) => {
    if (movie) {
      res.json({ statusCode: res.statusCode, movies: movie });
    }
    else {
      next({ statusCode: res.statusCode, message: "There are not any movies!" });
    }
  }).catch((err) => {
    console.error(err);
    res.send(err.message);
  });
});

router.get("/:movie_id", (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  promise.then((movie) => {
    if (movie) {
      res.json({ statusCode: res.statusCode, movie });
    }
    else {
      next({ statusCode: res.statusCode, message: "The movie was not found!" });
    }
  }).catch((err) => {
    if (err.name === "CastError") {
      next({ statusCode: res.statusCode, message: "The movie was not found!" });
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
    res.json({ statusCode: res.statusCode, statusCode: res.statusCode, added: movie });
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: err.message });
  });
});

router.put("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, req.body, { new: true }
  );
  promise.then((movie) => {
    if (movie) {
      res.json({ statusCode: res.statusCode, updated: movie });
    } else {
      next({ statusCode: res.statusCode, message: "The movie was not found!" });
    }
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: err.message });
  });
});

router.delete("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndDelete(req.params.movie_id);
  promise.then((movie) => {
    if (movie) {
      res.json({ statusCode: res.statusCode, statusCode: res.statusCode, deleted: true });
    } else {
      next({ statusCode: res.statusCode, message: "The movie was not found!" });
    }
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: err.message });
  })
});
module.exports = router;
