const {
  selectUserByUsername,
  selectAllUsers
} = require("../models/users-model");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.addNewUser = (req, res, next) => {
  const { user } = req.body;
  createNewUser(user)
    .then(user => {
      res.status(201).send({ user: user[0] });
    })
    .catch(next);
};
