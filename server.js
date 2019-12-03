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
  console.log(authVal);
  if (!authVal.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ message: "Required Bearer Authorization header not present" });
  }

  const token = authVal.split(" ")[1];
  console.log(token, process.env.API_TOKEN);
  if (token !== process.env.API_TOKEN) {
    return res.status(401).json({ message: "Invalid auth credentials" });
  }

  next();
}

app.get("/movie", requireAuth, (req, res) => {
  let response = movies;
  const genre = req.query.genre;
  const country = req.query.country;
  const avg_vote = req.query.avg_vote;

  if (genre) {
    console.log(genre);
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }
  if (country) {
    console.log(country);
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }
  if (avg_vote) {
    console.log(avg_vote);
    response = response.filter(movie => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }
  res.json(response);
});

app.listen(8000, () => console.log("listening to server"));
