const mongoose = require("mongoose");
const User = require("../models/user.model");
const sharp = require("sharp");

const getUserProfilePicture = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (!user.profilePicture) {
    res.status(404).json({ error: "Profile picture not found" });
    return;
  }

  res.set("Content-Type", "image/jpeg");
  const imageBase64 = Buffer.from(user.profilePicture.buffer).toString(
    "base64"
  );
  res.send(imageBase64);
};

const createUser = async (req, res) => {
  const currentUser = await User.findOne({ email: req.body.email });

  if (currentUser) {
    res.status(400).json({ error: "The user already exists." });
    return;
  }

  let imageBuffer = null;

  if (req.file && req.file.mime !== "image/jpeg")
    imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    lastName: req.body.lastName,
    profilePicture: imageBuffer,
  });

  user
    .save()
    .then(() => res.status(201).json(user))
    .catch((err) => res.status(500).json({ error: err }));
};

const validateUser = async (req, res) => {
  const { email, password } = req.body;

  const validatedUser = await User.findOne({
    email: email,
    password: password,
  });

  if (!validatedUser) {
    res.status(401).json({ error: "The credentials are incorrect." });
    return;
  }

  res.status(200).json({
    _id: validatedUser._id,
    name: validatedUser.name,
    lastName: validatedUser.lastName,
    email: validatedUser.email,
  });
};

module.exports = {
  createUser,
  validateUser,
  getUserProfilePicture,
};
