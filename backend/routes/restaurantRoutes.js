const express = require("express");
const router = express.Router();

const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * 🛠 CREATE RESTAURANT (ADMIN ONLY)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, image, address, isOpen } = req.body;

    const restaurant = new Restaurant({
      name,
      image,
      address,
      isOpen,
    });

    const savedRestaurant = await restaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
});

/**
 * 🍽 GET ALL RESTAURANTS (USER)
 */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isOpen: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
});

module.exports = router;
