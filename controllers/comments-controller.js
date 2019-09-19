const {
  removeCommentById,
  updateVotesByCommentId
} = require("../models/comments-model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(comment => {
      res.status(204).send({ msg: "Comment has been removed" });
    })
    .catch(next);
};

exports.patchVotesByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByCommentId(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
