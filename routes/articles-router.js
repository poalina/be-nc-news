const articlesRouter = require("express").Router();
const {
  patchVotesByArticleId,
  getArticleById,
  postCommentByArticleId,
  getAllCommentsByArticleId,
  getAllArticles,
  addNewArticle
} = require("../controllers/articles-controller");
const { handle405Error } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId)
  .all(handle405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getAllCommentsByArticleId)
  .all(handle405Error);

articlesRouter
  .route("/")
  .get(getAllArticles)
  .post(addNewArticle)
  .all(handle405Error);

module.exports = articlesRouter;
