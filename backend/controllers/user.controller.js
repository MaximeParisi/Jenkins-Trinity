const { ROLES } = require("../models");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!req?.user?.roles?.includes("admin") && userId !== req.user.id) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    req.user.password = null;
    res.status(200).send({ user: req.user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  console.log("getall")
  try {
    if (!req?.user?.roles?.includes("admin")) {
      req.user.password = '';
      res.status(200).send({ user: req.user });
      return;
    }

    const users = await User.find().select('-password').populate('roles', 'name');
    res.status(200).send({ users });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err)
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    };

    if (req.body.password && req.body.password !== '') {
      updateData.password = bcrypt.hashSync(req.body.password, 8);
    }

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      updateData.roles = roles.map((role) => role._id);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res
      .status(200)
      .send({ message: "User updated successfully.", user: updatedUser });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log(err);
  }
};

exports.setRole = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req?.body?.roles || req.body.roles.length === 0) {
      return res.status(400).json({ message: 'Veuillez fournir au moins un rôle.' });
    }

    const roles = await Role.find({ name: { $in: req.body.roles } });

    if (roles.length === 0) {
      return res.status(404).json({ message: 'Aucun rôle correspondant trouvé.' });
    }

    const updateData = {
      roles: roles.map((role) => role._id),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).populate('roles', 'name');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({
      message: 'Rôles mis à jour avec succès.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des rôles :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  console.log("getme")
  try {
    const user = await User.findById(req.user.id).populate("roles", "name");
    if (!user) return res.status(404).send({ message: "Utilisateur non trouvé." });

    res.status(200).send({ user });
  } catch (error) {
    console.error("Erreur getMe:", error);
    res.status(500).send({ message: "Erreur serveur." });
  }
};

