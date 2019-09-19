const articlesRouter = require("express").Router();
const {
  patchVotesByArticleId,
  getArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId);

module.exports = articlesRouter;
