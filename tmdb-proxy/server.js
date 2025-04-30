const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Middleware to proxy TMDB API requests
app.use('/api', createProxyMiddleware({
  target: 'https://api.themoviedb.org/3',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }, // Remove '/api' prefix when forwarding
  onProxyReq: (proxyReq) => {
    // Add TMDB API authorization header
    proxyReq.setHeader('Authorization', `Bearer ${process.env.TMDB_BEARER_TOKEN}`);
    proxyReq.setHeader('accept', 'application/json');
  },
}));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Proxy server is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
