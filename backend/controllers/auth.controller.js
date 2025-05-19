const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      password: bcrypt.hashSync(req.body.password, 8),
      billingAddress: {
        address: req.body.address,
        zipCode: req.body.zipCode,
        city: req.body.city,
        country: req.body.country,
      },
    });

    await user.save();

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "admin" });
      user.roles = [role._id];
    }

    await user.save();
    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ phoneNumber: req.body.phoneNumber })
      .populate("roles", "-__v")
      .exec();

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours,
    });

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production", // ne le mets pas en dev/local
      path: "/",
    });

    res.status(200).send({
      id: user._id,
      fistname: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      token: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
};
