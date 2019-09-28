const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users-controller");
const { handle405Error } = require("../errors/errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405Error);

module.exports = usersRouter;
