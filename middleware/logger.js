//@desc Logs req to console shows method & url a custom middleware
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")} ${req.originalUrl}`
  );
  next();
};

module.exports = logger;
