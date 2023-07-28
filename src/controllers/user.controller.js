const mongoose = require("mongoose");
const User = require("../models/user.model");
const UserConfig = require("../models/userConfig.model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const emailService = require("../utils/emailService");

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
  let imageBuffer = null;

  if (req.file) {
    if (req.file.mime !== "image/jpeg")
      imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
    else imageBuffer = req.file.buffer;
  } else {
    const defaultProfilePicPath = path.join(
      __dirname,
      "..",
      "assets",
      "default-pic.jpeg"
    );
    try {
      imageBuffer = fs.readFileSync(defaultProfilePicPath);
    } catch (err) {
      console.log("Default profile picture not found:", err);
    }
  }

  try {
    const newUser = await User.create({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      lastName: req.body.lastName,
      profilePicture: imageBuffer,
    });

    await UserConfig.create({
      _id: new mongoose.Types.ObjectId(),
      userId: newUser._id,
    });

    emailService.sendWelcomeEmail(
      newUser.email,
      `${newUser.name} ${newUser.lastName}`
    );

    res.status(201).json({ user: newUser, config: { userId: newUser._id } });
  } catch (err) {
    res.status(500).json({ error: err });
  }
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
