const express = require("express");

const router = express.Router();

const {
  getUsers,
  addUser,
  updateUser,
  updateUserStatus
} = require("../controllers/userController");


// Get all users
router.get("/", getUsers);


// Add user
router.post("/", addUser);


// Update user
router.put("/:id", updateUser);


// Activate / deactivate user
router.put("/:id/status", updateUserStatus);


module.exports = router;