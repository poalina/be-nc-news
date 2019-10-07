const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const {
  handleCustomErrors,
  handlePsqlErrors400,
  handlePsqlErrors404,
  handleServerErrors,
  handle405Error
} = require("./errors/errors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", (req, res, next) =>
  res.status(404).send({ msg: "Page not found" })
);

app.use(handleCustomErrors);
app.use(handlePsqlErrors404);
app.use(handlePsqlErrors400);
app.use(handleServerErrors);
app.use(handle405Error);

module.exports = app;
