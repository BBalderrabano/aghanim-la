const express = require("express");
const router = express.Router();

// Controllers
const {
  register,
  login,
  logout,
  getLoggedInUser,
  getAllUsers,
  getPendingUsers,
  preaproveUser,
  deleteUser,
  aproveUser,
  updateUser,
  getUserById,
} = require("../controllers/usersController");

// Middlewares
const {
  userRegisterValidator,
  userPreaproveValidator,
  isAdminRoleValidator,
  userById,
} = require("../middlewares/users");

const { verifyToken } = require("../middlewares/auth");

// Api Routes
router.post("/register", userRegisterValidator, register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/user/:id?", verifyToken, userById, getUserById, getLoggedInUser);

router.get("/api/users/all", verifyToken, userById, getAllUsers);
router.get("/api/users/pending", verifyToken, userById, getPendingUsers);
router.post("/api/users/aprove/:id", verifyToken, userById, aproveUser);
router.post(
  "/api/users/preaprove",
  verifyToken,
  userById,
  userPreaproveValidator,
  preaproveUser
);
router.post(
  "/api/users/update/:id",
  verifyToken,
  userById,
  isAdminRoleValidator,
  updateUser
);
router.delete("/api/users/delete/:id", verifyToken, userById, deleteUser);

module.exports = router;
