const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const myListRoutes = require("./routes/mylist");

dotenv.config();

const app = express();

app.use(cors({ origin: ["http://localhost:3000", "https://movielens18.web.app"] })); // Explicit origin
app.use(express.json());
connectDB();

app.use("/api/mylist", myListRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});
