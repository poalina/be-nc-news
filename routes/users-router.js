const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers,
  addNewUser
} = require("../controllers/users-controller");
const { handle405Error } = require("../errors/errors");

usersRouter
  .route("/")
  .get(getAllUsers)
  .post(addNewUser)
  .all(handle405Error);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405Error);

module.exports = usersRouter;
