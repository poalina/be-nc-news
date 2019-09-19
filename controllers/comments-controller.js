const { removeCommentById } = require("../models/comments-model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(comment => {
      res.status(204).send({ msg: "Comment has been removed" });
    })
    .catch(next);
};
