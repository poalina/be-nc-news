const connection = require("../db/connection");

exports.insertCommentByArticleId = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*");
};
