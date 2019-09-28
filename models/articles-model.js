const connection = require("../db/connection");

const {
  checkIfTopicExist,
  checkIfAuthorExist
} = require("../controllers/utils");

exports.selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic
) => {
  return connection
    .select("articles.*")
    .from("articles")
    .orderBy(sort_by, order)
    .count("comments.article_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(queryBuilder => {
      if (author) queryBuilder.where({ "articles.author": author });
      if (topic) queryBuilder.where({ topic });
    })
    .then(articles => {
      if (!articles.length && author && topic) {
        return Promise.all([
          articles,
          checkIfAuthorExist(author),
          checkIfTopicExist(topic)
        ]);
      }

      if (!articles.length && author) {
        return Promise.all([articles, checkIfAuthorExist(author)]);
      }
      if (!articles.length && topic) {
        return Promise.all([articles, checkIfTopicExist(topic)]);
      }
      return [articles];
    })
    .then(([articles]) => {
      return articles.map(element => {
        element.comment_count = +element.comment_count;
        console.log(element, "====Art model 45");
        return element;
      });
    });
};

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
