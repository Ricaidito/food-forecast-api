const mongoose = require("mongoose");
const User = require("../models/user.model");
const UserConfig = require("../models/userConfig.model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      userId: validatedUser._id,
    });

    if (!userConfig)
      await UserConfig.create({
        _id: new mongoose.Types.ObjectId(),
        userId: user._id,
      });

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createUser,
  getUserProfilePicture,
  loginUser,
};
