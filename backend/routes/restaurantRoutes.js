const express = require("express");
const router = express.Router();
const ownerMiddleware = require("../middleware/ownerMiddleware");
const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * 🛠 CREATE RESTAURANT (ADMIN ONLY)
 */
router.post("/", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const { name, image, address, isOpen } = req.body;
    const existingRestaurant = await Restaurant.findOne({
      owner: req.user.id,
    });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ message: "Owner already has a restaurant" });
    }

    const restaurant = new Restaurant({
      name,
      image,
      address,
      isOpen,
      owner:req.user.id,
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
// GET MY RESTAURANT (OWNER)
router.get("/owner/my", authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * 🍽 GET ALL RESTAURANTS (PUBLIC / USER)
 */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
