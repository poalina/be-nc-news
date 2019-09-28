const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics-controller");
const { handle405Error } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getAllTopics)
  .all(handle405Error);

module.exports = topicsRouter;
