const express = require("express");
const router = express.Router();
const UserList = require("../models/UserList");
const { validateEmail, validateMovie } = require("../middleware/validate");

router.get("/:email", validateEmail, async (req, res) => {
  try {
    const email = req.validatedEmail;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userList = await UserList.findOne({ email });
    if (!userList) {
      return res.status(200).json({ movies: [], totalPages: 1 });
    }

    const movies = userList.movies.slice(skip, skip + limit);
    const totalMovies = userList.movies.length;
    const totalPages = Math.ceil(totalMovies / limit) || 1;

    res.status(200).json({ movies, totalPages });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateEmail, validateMovie, async (req, res) => {
  try {
    const { movie } = req.body;
    const email = req.validatedEmail;
    let userList = await UserList.findOne({ email });

    if (userList) {
      if (userList.movies.some((m) => m.id === movie.id)) {
        return res.status(200).json(userList.movies);
      }
      userList.movies.push(movie);
      await userList.save();
    } else {
      userList = new UserList({ email, movies: [movie] });
      await userList.save();
    }

    res.status(201).json(userList.movies);
  } catch (error) {
    console.error("Error adding movie to list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:email/:movieId", validateEmail, async (req, res) => {
  try {
    const email = req.validatedEmail;
    const { movieId } = req.params;
    const userList = await UserList.findOne({ email });

    if (!userList) {
      return res.status(404).json({ error: "Movie list not found" });
    }

    const initialLength = userList.movies.length;
    userList.movies = userList.movies.filter(
      (movie) => movie.id !== parseInt(movieId)
    );

    if (userList.movies.length === initialLength) {
      return res.status(404).json({ error: "Movie not found in list" });
    }

    await userList.save();
    res.status(200).json(userList.movies);
  } catch (error) {
    console.error("Error deleting movie from list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
