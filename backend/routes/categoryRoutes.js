const express = require("express");
const router = express.Router();
const multer = require("multer");
const categoryController = require("../controllers/categoryController");

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    fieldSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Routes
router.post("/", upload.single("image"), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id", upload.single("image"), categoryController.updateCategory);

module.exports = router;
