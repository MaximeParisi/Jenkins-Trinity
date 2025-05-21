const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
             ||req.cookies["accessToken"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);

    const user = await User.findById(decoded.id).populate("roles").exec();

    if (!user) return res.status(404).send({ message: "User not found" });

    req.user = {
      id: user._id,
      roles: user.roles.map((role) => role.name),
    };

    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

isAdmin = (req, res, next) => {
  try {
    const roles = req.user.roles;

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

isModerator = (req, res, next) => {
  try {
    const roles = req.user.roles;

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({ message: "Require Moderator Role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};

module.exports = authJwt;
