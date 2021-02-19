const ErrorResponse = require("../utils/errorResponse");
//express validation 3rd part error handling
const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  let error = { ...err };

  error.message = err.message;
  console.log(err.name);

  //Mongoose bad objectId
  if (err.name === "CastError") {
    const message = `Bootcamp not found with Id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered `;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = errorHandler;

//Ref :https://expressjs.com/en/guide/error-handling.html
