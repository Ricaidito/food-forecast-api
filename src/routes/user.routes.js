const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// POST /users
router.post("/users", userController.createUser);

module.exports = router;
