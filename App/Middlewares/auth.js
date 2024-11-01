const jwt = require("jsonwebtoken");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

async function auth(req, res, next) {
  const token = req.cookies.auth_token;
  req.isAuthenticated = false;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);

    req.isAuthenticated = true;

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next();
    }
    console.error("Token verification error:", error);
    return next();
  }
}

module.exports = auth;
