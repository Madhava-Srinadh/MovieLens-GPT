require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Parse CLIENT_ORIGINS
const rawOrigins = process.env.CLIENT_ORIGINS || "";
const ALLOWED_ORIGINS = rawOrigins
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS Policy: Origin ${origin} not allowed`));
    },
  })
);

// Proxy settings
const TMDB_BASE = "https://api.themoviedb.org/3";
const BEARER = `Bearer ${process.env.TMDB_BEARER_TOKEN}`;

// ← Here’s the only change, use `(.*)` instead of `(*)`
app.get("/api/:path(.*)", async (req, res) => {
  const path = req.params.path;
  const queryParams = req.query;
  const tmdbUrl =
    `${TMDB_BASE}/${path}` +
    (Object.keys(queryParams).length
      ? `?${new URLSearchParams(queryParams).toString()}`
      : "");

  try {
    const tmdbRes = await axios.get(tmdbUrl, {
      params: queryParams,
      headers: {
        accept: "application/json",
        Authorization: BEARER,
      },
    });
    res.json(tmdbRes.data);
  } catch (err) {
    res
      .status(err.response?.status || 500)
      .json({ status_message: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", allowedOrigins: ALLOWED_ORIGINS });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🎬 TMDB Proxy running on http://localhost:${port}`);
});
