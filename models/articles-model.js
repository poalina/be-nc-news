const connection = require("../db/connection");

exports.updateVotesByArticleId = (article_id, inc_votes) => {
  return connection
    .increment("votes", inc_votes || 0)
    .into("articles")
    .where("article_id", "=", article_id)
    .returning("*")
    .then(article => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      } else {
        return article;
      }
    });
};

exports.sendArticleById = article_id => {
  return connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", article_id)
    .count("comments.article_id AS comment_count")
    .groupBy("articles.article_id")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .then(article => {
      // console.log(article, "=======MODEL ARTICLE");
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: "Article not found"
        });
      } else {
        return article.map(element => {
          element.comment_count = +element.comment_count;
          return element;
        });
      }
    });
};
