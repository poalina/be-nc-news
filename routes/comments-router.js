const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchVotesByCommentId
} = require("../controllers/comments-controller");
const { handle405Error } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchVotesByCommentId)
  .all(handle405Error);

module.exports = commentsRouter;
