const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  poster_path: { type: String, default: "" },
  overview: { type: String, default: "" },
  release_date: { type: String, default: "" },
});

const userListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  movies: [movieSchema],
});

module.exports = mongoose.model("UserList", userListSchema);
