// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// 1. Parse CLIENT_ORIGINS into an array
const rawOrigins = process.env.CLIENT_ORIGINS || "";
const ALLOWED_ORIGINS = rawOrigins
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

// 2. CORS middleware: only allow your frontends
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g. curl, Postman)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS Policy: Origin ${origin} not allowed`));
    },
  })
);

// 3. Proxy settings
const TMDB_BASE = "https://api.themoviedb.org/3";
const BEARER = `Bearer ${process.env.TMDB_BEARER_TOKEN}`;

// 4. Single generic route for movie categories
app.get("/api/movie/:category", async (req, res) => {
  const { category } = req.params;
  const { page = 1, language = "en-US" } = req.query;

  try {
    const tmdbRes = await axios.get(`${TMDB_BASE}/movie/${category}`, {
      params: { page, language },
      headers: {
        accept: "application/json",
        Authorization: BEARER,
      },
    });
    res.json(tmdbRes.data);
  } catch (err) {
    console.error("[TMDB PROXY ERROR]", err.message);
    res
      .status(err.response?.status || 500)
      .json({ status_message: err.message });
  }
});

// 5. Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🎬 TMDB Proxy running on http://localhost:${port}`);
});
