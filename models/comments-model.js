const connection = require("../db/connection");

exports.insertCommentByArticleId = comment => {
  return connection
    .insert(comment)
    .into("comments")
    .returning("*");
};

exports.selectAllCommentsByArticleId = article_id => {
  if (isNaN(article_id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input - number is required"
    });
  }
  return (
    connection
      .select("*")
      .from("comments")
      .where({ article_id })
      //any valid column (defaults to created_at)
      //.orderBy("created_at")
      .then(comments => {
        console.log(comments, "=== com model");
        if (!article.length) {
          return Promise.reject({
            status: 404,
            msg: "Article not found"
          });
        }
        return comments;
      })
  );
};
