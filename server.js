require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const movies = require("./movieData");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

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

app.get("/movie", (req, res) => {
  res.json(movies);
});

app.listen(8000, () => console.log("listening to server"));
