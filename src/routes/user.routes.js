const express = require("express");
const multer = require("multer");
const { fileFilter, limits } = require("../configs/image.config");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

const userController = require("../controllers/user.controller");

const router = express.Router();

// GET /users
router.get("/profile-pic/:id", userController.getUserProfilePicture);

// POST /users
router.post("/", upload.single("profilePicture"), userController.createUser);
router.post("/validate", userController.validateUser);

module.exports = router;
