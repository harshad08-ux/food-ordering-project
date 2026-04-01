const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");
const Restaurant = require("../models/Restaurant");


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

    // OWNER: GET MY RESTAURANT FOODS
    router.get("/owner/my", authMiddleware, ownerMiddleware, async (req, res) => {
      try {
        const restaurant = await Restaurant.findOne({
          owner: req.user.id
        });
    
        if (!restaurant) {
          return res.status(404).json({
            message: "Restaurant not found"
          });
        }
    
        // ✅ BLOCK IF NOT APPROVED
        if (restaurant.approvalStatus !== "approved") {
          return res.status(403).json({
            message: "Restaurant pending admin approval"
          });
        }
    
        const foods = await Food.find({
          restaurant: restaurant._id
        });
    
        res.json(foods);
    
      } catch (error) {
        res.status(500).json({
          message: "Server error"
        });
      }
    });


// ==============================
// ➕ ADD FOOD (ADMIN ONLY)
// ==============================
// ➕ ADD FOOD (ADMIN or OWNER)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, price, image, category, description, isVeg, restaurant } = req.body;

    let restaurantId;

    // 🔹 If Owner → auto attach their restaurant
    if (req.user.role === "owner") {
      const ownerRestaurant = await Restaurant.findOne({ owner: req.user.id });

      if (!ownerRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      restaurantId = ownerRestaurant._id;
    }

    // 🔹 If Admin → must send restaurant ID
    else if (req.user.role === "admin") {
      if (!restaurant) {
        return res.status(400).json({ message: "Restaurant is required" });
      }
      restaurantId = restaurant;
    }

    else {
      return res.status(403).json({ message: "Access denied" });
    }

    const food = new Food({
      name,
      price,
      image,
      category,
      description,
      isVeg,
      restaurant: restaurantId,
    });

    const savedFood = await food.save();
    res.status(201).json(savedFood);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

    // OWNER: DELETE FOOD
router.delete("/:id", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await food.deleteOne();

    res.json({ message: "Food deleted" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✏️ UPDATE FOOD (OWNER ONLY)
router.put("/:id", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // Ensure owner owns this restaurant
    if (food.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, price, category, image, description, isVeg } = req.body;

    food.name = name ?? food.name;
    food.price = price ?? food.price;
    food.category = category ?? food.category;
    food.image = image ?? food.image;
    food.description = description ?? food.description;
    food.isVeg = isVeg ?? food.isVeg;

    const updatedFood = await food.save();

    res.json(updatedFood);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// OWNER: TOGGLE FOOD AVAILABILITY
router.put("/:id/toggle", authMiddleware, ownerMiddleware, async (req, res) => {
  try {

    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    food.isAvailable = !food.isAvailable;

    await food.save();

    res.json(food);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
