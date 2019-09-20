const connection = require("../db/connection");

exports.checkIfArticleExist = article_id => {
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

exports.checkIfAuthorExist = author => {
  return connection
    .select("*")
    .from("articles")
    .where({ author })
    .then(author => {
      if (!author.length) {
        return Promise.reject({ status: 404, msg: "Author not found" });
      }
      return true;
    });
};

exports.checkIfTopicExist = topic => {
  return connection
    .select("*")
    .from("topics")
    .where({ slug: topic })
    .then(topic => {
      if (!topic.length) {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
      return true;
    });
};
