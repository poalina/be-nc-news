const connection = require("../db/connection");
const { checkIfArticleExist } = require("../controllers/utils");

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
        return Promise.all([comments, checkIfArticleExist(article_id)]);
      }
      return [comments];
    })
    .then(([comments]) => {
      return comments;
    });
};

exports.removeCommentById = comment_id => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .del()
    .then(deletedComment => {
      if (!deletedComment) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return "Deleted";
    });
};

exports.updateVotesByCommentId = (comment_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes || 0)
    .into("comments")
    .where("comment_id", "=", comment_id)
    .returning("*")
    .then(comment => {
      if (!comment.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found"
        });
      }
      return comment;
    });
};
