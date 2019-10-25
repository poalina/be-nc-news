const connection = require("../db/connection");

const {
  checkIfTopicExist,
  checkIfAuthorExist
} = require("../controllers/utils");

exports.selectAllArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  p = 1
) => {
  if (!["desc", "asc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request"
    });
  }
  return connection
    .select("articles.*")
    .from("articles")
    .orderBy(sort_by, order)
    .limit(limit)
    .offset((p - 1) * limit)
    .count("comments.article_id AS comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .modify(queryBuilder => {
      if (author) queryBuilder.where({ "articles.author": author });
      if (topic) queryBuilder.where({ topic });
    })
    .then(articles => {
      if (!articles.length) {
        return Promise.all([
          articles,
          checkIfAuthorExist(author),
          checkIfTopicExist(topic)
        ]);
      }
      return [articles];
    })
    .then(([articles]) => {
      return articles.map(element => {
        element.comment_count = +element.comment_count;
        return element;
      });
    });
};

exports.postNewArticle = article => {
  return connection
    .insert(article)
    .into("articles")
    .returning("*")
    .then(([article]) => {
      return article;
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
