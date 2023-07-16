const mongoose = require("mongoose");
const User = require("../models/user.model");

// TODO: Add logic to not allow duplicate users.
const createUser = async (req, res) => {
  const image = req.file ? req.file.buffer : null;
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    lastName: req.body.lastName,
    profilePicture: image,
  });

  user
    .save()
    .then(() => res.status(201).json(user))
    .catch(err => res.status(500).json({ error: err }));
};

const validateUser = async (req, res) => {
  const { email, password } = req.body;

  const validatedUser = await User.findOne({
    email: email,
    password: password,
  });

  if (!validatedUser) {
    return res.status(401).json({ error: "The credentials are incorrect." });
  }

  return res.status(200).json({
    _id: validatedUser._id,
    name: validatedUser.name,
    lastName: validatedUser.lastName,
    email: validatedUser.email,
  });
};

module.exports = {
  createUser,
  validateUser,
};
