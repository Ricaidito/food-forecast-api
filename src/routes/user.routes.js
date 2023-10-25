const userController = require("../controllers/user.controller");
const express = require("express");
const multer = require("multer");
const { fileFilter, limits } = require("../configs/fileConfig");

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
router.post("/login", userController.loginUser);

// PUT /users
router.put("/update/:userId", userController.updateUserInfo);
router.put(
  "/update-profile-pic/:userId",
  upload.single("profilePicture"),
  userController.updateProfilePicture
);

module.exports = router;
