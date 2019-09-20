exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err, "------ERROR from APP");
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePsqlErrors404 = (err, req, res, next) => {
  const psqlBadRequestCodes404 = ["23503"];
  if (psqlBadRequestCodes404.includes(err.code))
    res.status(404).send({ msg: "Data does not exist" });
  else next(err);
};

exports.handlePsqlErrors400 = (err, req, res, next) => {
  const psqlBadRequestCodes400 = {
    "22P02": "Invalid input - number is required",
    //"23503": "Data does not exist",
    "42703": "Incorrect input"
  };
  if (psqlBadRequestCodes400[err.code])
    res
      .status(400)
      .send({ msg: psqlBadRequestCodes400[err.code] || "Bad Request" });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
