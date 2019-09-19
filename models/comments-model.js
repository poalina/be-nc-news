const connection = require("../db/connection");

exports.insertCommentByArticleId = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*");
};

exports.selectAllCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input - number is required"
    });
  }
  return connection
    .select("*")
    .from("comments")
    .orderBy(sort_by, order)
    .modify(queryBuilder => {
      if (article_id) queryBuilder.where({ article_id });
    })
    .then(comments => {
      if (!comments.length && article_id) {
        return Promise.all([comments, checkArticleExist(article_id)]);
      }
      return [comments];
    })
    .then(([comments]) => {
      return comments;
    });
};
const checkArticleExist = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id })
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }

      return true;
    });
};

exports.removeCommentById = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .del()
    .then(comment => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return "Deleted";
    });
};
