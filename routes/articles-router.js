const articlesRouter = require("express").Router();
const {
  patchVotesByArticleId,
  getArticleById
} = require("../controllers/articles-controller");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId);

module.exports = articlesRouter;
