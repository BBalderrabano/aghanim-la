const express = require("express");
const router = express.Router();

// Controllers
const {
  getAllClasses,
  getEnabledClasses,
  addClass,
  deleteClass,
  updateClass
} = require("../controllers/classesController");

// Middlewares
const { userById } = require("../middlewares/users");
const { verifyToken } = require("../middlewares/auth");
const { classesRegisterValidator } = require("../middlewares/laclasses");

// Api Routes
router.get("/classes/all", verifyToken, userById, getAllClasses);
router.get("/classes/enabled", getEnabledClasses);

router.post("/classes/add", classesRegisterValidator, verifyToken, userById, addClass);
router.post("/classes/update/:id", classesRegisterValidator, verifyToken, userById, updateClass);
router.delete("/classes/delete/:id", verifyToken, userById, deleteClass);

module.exports = router;
