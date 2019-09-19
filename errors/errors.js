exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err, "------ERROR from APP");
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = {
    "22P02": "Invalid input - number is required",
    "23503": "Data does not exist",
    "42703": "Incorrect input"
  };
  if (psqlBadRequestCodes[err.code])
    res
      .status(400)
      .send({ msg: psqlBadRequestCodes[err.code] || "Bad Request" });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
