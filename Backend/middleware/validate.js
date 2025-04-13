const validator = require("validator");

const validateEmail = (req, res, next) => {
  let email = req.body?.email || req.params?.email;

  if (!email) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  if (req.method === "GET") {
    email = decodeURIComponent(email);
  }

  email = String(email).trim();

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  req.validatedEmail = email;
  next();
};

const validateMovie = (req, res, next) => {
  const { movie } = req.body;
  if (!movie || !movie.id || !movie.title) {
    return res.status(400).json({ error: "Movie must include id and title" });
  }
  if (typeof movie.id !== "number") {
    return res.status(400).json({ error: "Movie id must be a number" });
  }
  next();
};

module.exports = { validateEmail, validateMovie };
