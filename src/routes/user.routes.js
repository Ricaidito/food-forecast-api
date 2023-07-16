const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// POST /users
router.post("/", userController.createUser);
router.post("/validate", userController.validateUser);

module.exports = router;
