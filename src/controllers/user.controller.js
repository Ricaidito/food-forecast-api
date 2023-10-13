const mongoose = require("mongoose");
const User = require("../models/user.model");
const UserConfig = require("../models/userConfig.model");
const sharp = require("sharp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/authConfig");
const emailService = require("../utils/emailService");
const fileService = require("../utils/fileService");

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
  } else imageBuffer = fileService.getDefaultProfilePicture();

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const newUser = await User.create({
      _id: new mongoose.Types.ObjectId(),
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      lastName: req.body.lastName,
      profilePicture: imageBuffer,
    });

    await UserConfig.create({
      _id: new mongoose.Types.ObjectId(),
      userId: newUser._id,
    });

    // emailService.sendWelcomeEmail(
    //   newUser.email,
    //   `${newUser.name} ${newUser.lastName}`
    // );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const userConfig = await UserConfig.findOne({
      userId: user._id,
    });

    if (!userConfig)
      await UserConfig.create({
        _id: new mongoose.Types.ObjectId(),
        userId: user._id,
      });

    const token = jwt.sign({ userId: user._id }, authConfig.secretKey, {
      expiresIn: authConfig.tokenExpireTime,
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateUserInfo = async (req, res) => {
  const userId = req.params.userId;
  const { name, lastName } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.name = name;
    user.lastName = lastName;

    await user.save();

    res.status(200).json({ message: "User info updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateProfilePicture = async (req, res) => {
  const userId = req.params.userId;
  let imageBuffer = null;
  if (req.file.mime !== "image/jpeg")
    imageBuffer = await sharp(req.file.buffer).jpeg().toBuffer();
  else imageBuffer = req.file.buffer;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.profilePicture = imageBuffer;

    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  loginUser,
  createUser,
  getUserProfilePicture,
  updateUserInfo,
  updateProfilePicture,
};
