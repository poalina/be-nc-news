const { updateVotesByArticleId } = require("../models/articles-model");

exports.patchVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByArticleId(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
