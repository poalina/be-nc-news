const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const endPoints = require("../endpoints.json");
const { handle405Error } = require("../errors/errors");

apiRouter
  .route("/")
  .get((req, res) => res.status(200).send(endPoints))
  .all(handle405Error);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
