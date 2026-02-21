const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ==============================
// 🍽️ GET ALL FOODS (ADMIN / GENERAL)
// ==============================
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurant", "name");
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// 🍽️ GET FOODS BY RESTAURANT
// ==============================
router.get("/restaurant/:id", async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.id,
    });

    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ==============================
// ➕ ADD FOOD (ADMIN ONLY)
// ==============================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, price, image, category, restaurant } = req.body;

      if (!restaurant) {
        return res.status(400).json({ message: "Restaurant is required" });
      }

      const food = new Food({
        name,
        price,
        image,
        category,
        restaurant, // 🔥 IMPORTANT
      });

      const savedFood = await food.save();
      res.status(201).json(savedFood);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
