const jwt = require("jsonwebtoken");
const userSecret = "userAuthenticator";

function authenticate(req, res, next) {
  const authHeader =
    req.headers["authorization"] ?? req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ error: "Not Allowed" });

  jwt.verify(token, userSecret, (err, user) => {

    if (err) return res.status(403).json({ error: "Not Allowed" });

    req.user = user;

    next();
  });
}

module.exports = authenticate;