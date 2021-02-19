class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
  }
}

module.exports = ErrorResponse;
