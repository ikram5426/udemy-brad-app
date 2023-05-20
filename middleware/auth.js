const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token , Authentication failed" });
  }
  try {
    const decoded = jwt.verify(token, config.get("secret"));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token not valid" });
  }
};
