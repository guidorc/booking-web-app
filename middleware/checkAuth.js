const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // check for authorization header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // check for token existance
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  // validate token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    if (!decodedToken) {
      req.isAuth = false;
      return next();
    }

    // token authorization is valid
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    req.isAuth = false;
    return next();
  }
};
