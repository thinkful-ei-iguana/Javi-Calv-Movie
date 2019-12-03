require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const movies = require("./movieData");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

function requireAuth(req, res, next) {
  const authVal = req.get("Authorization") || "";

  if (!authVal.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ message: "Required Bearer Authorization header not present" });
  }

  const token = authVal.split(" ")[1];
  if (token !== process.env.API_TOKEN) {
    return res.status(401).json({ message: "Invalid auth credentials" });
  }

  next();
}

app.get("/movie", requireAuth, (req, res) => {
  res.json(movies);
});

app.listen(8000, () => console.log("listening to server"));
