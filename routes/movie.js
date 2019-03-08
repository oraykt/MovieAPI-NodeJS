const express = require('express');
const router = express.Router();
// Models 
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    },
    {
      $unwind: '$director'
    }
  ]);
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

router.get("/top10", (req, res) => {
  const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 });
  promise.then((movies) => {
    if (movies) {
      res.json({ statusCode: res.statusCode, topMovies: movies });
    } else {
      next({ statusCode: res.statusCode, message: "There are not any movies!" });
    }
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: err.message });
  });
});

// between
router.get('/between/:start_year/:end_year', (req, res, next) => {
  const { start_year, end_year } = req.params;
  // lte <= || gte >= || lt < || gt >
  const promise = Movie.find({ year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) } });
  promise.then((movies) => {
    if (movies.length !== 0) {
      res.json({ statusCode: res.statusCode, topMovies: movies });
    } else {
      next({ statusCode: res.statusCode, message: `There are not any movies between ${start_year} and ${end_year}` });
    }
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: err.message });
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
    res.json({ statusCode: res.statusCode, added: movie });
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
    res.json({ statusCode: res.statusCode, updated: movie });
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: "The movie was not found!" });
  });
});

router.delete("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndDelete(req.params.movie_id);
  promise.then((movie) => {
    res.json({ statusCode: res.statusCode, deleted: true });
  }).catch((err) => {
    console.error(err);
    next({ statusCode: res.statusCode, message: "The movie was not found!" });
  });
});

module.exports = router;
