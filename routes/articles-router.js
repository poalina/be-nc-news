const articlesRouter = require("express").Router();
const {
  patchVotesByArticleId,
  getArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId,
  getAllArticles
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId);

articlesRouter.route("/").get(getAllArticles);

module.exports = articlesRouter;
