const userController = require("../controllers/user.controller");
const express = require("express");
const multer = require("multer");
const { fileFilter, limits } = require("../configs/imageConfig");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const router = express.Router();

// GET /users
router.get("/profile-pic/:userId", userController.getUserProfilePicture);

// POST /users
router.post("/", upload.single("profilePicture"), userController.createUser);
router.post("/validate", userController.validateUser);

module.exports = router;
