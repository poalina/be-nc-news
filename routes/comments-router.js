const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchVotesByCommentId
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchVotesByCommentId);

module.exports = commentsRouter;
