const {
  selectAllArticles,
  updateVotesByArticleId,
  sendArticleById
} = require("../models/articles-model");
const {
  insertCommentByArticleId,
  selectAllCommentsByArticleId
} = require("../models/comments-model");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByArticleId(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  sendArticleById(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = { ...req.body };
  comment.article_id = article_id;
  comment.author = comment.username;
  delete comment.username;
  insertCommentByArticleId(comment)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { order, sort_by } = req.query;
  selectAllCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
