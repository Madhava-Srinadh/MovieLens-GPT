// server.js
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

// Parse CLIENT_ORIGINS
const rawOrigins = process.env.CLIENT_ORIGINS || "";
const ALLOWED_ORIGINS = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Policy: Origin ${origin} not allowed`));
      }
    },
  })
);

// Middleware to proxy TMDB API requests
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api.themoviedb.org/3",
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // Remove '/api' prefix
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader(
        "Authorization",
        `Bearer ${process.env.TMDB_BEARER_TOKEN}`
      );
      proxyReq.setHeader("accept", "application/json");
    },
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Proxy server is running" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
