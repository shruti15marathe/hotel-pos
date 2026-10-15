const express = require("express");
const router = express.Router();

const {
  getMenu,
  addMenuItem,
  getCategories,
  updateMenuItem,
  deleteMenuItem,
  addCategory,
  updateCategory,
  updateCategoryStatus
} = require("../controllers/menuController");

const upload = require("../config/upload");

router.get("/", getMenu);
router.post("/", upload.single("image"), addMenuItem);

router.delete("/:id", deleteMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);

router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.put("/categories/:id", updateCategory);
router.put("/categories/:id/status", updateCategoryStatus);

module.exports = router;