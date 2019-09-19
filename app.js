const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Route not found" })
);
app.use((err, req, res, next) => {
  console.log(err, "------ERROR from APP");
  if (err.code === "22P02" || err.status === 400) {
    res.status(400).send({ msg: "Invalid input - number is required" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "Incorrect input" });
  }
  res.status(404).send(err);
});

module.exports = app;

// const psqlErorrs = { "22P02": "Invalid input" };

// psqlErorrs[err.code];
