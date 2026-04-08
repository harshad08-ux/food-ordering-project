const express = require("express");
const router = express.Router();
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");
const Restaurant = require("../models/Restaurant");

const multer = require("multer");
const path = require("path");

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET ALL FOODS
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurant", "name");
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET FOODS BY RESTAURANT
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

// OWNER MY FOODS
router.get("/owner/my", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const foods = await Food.find({
      restaurant: restaurant._id,
    });

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ADD FOOD WITH IMAGE UPLOAD
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description, isVeg } = req.body;

    const image = req.file
      ? `http://localhost:5000/uploads/${req.file.filename}`
      : "";

    let restaurantId;

    if (req.user.role === "owner") {
      const ownerRestaurant = await Restaurant.findOne({
        owner: req.user.id,
      });

      if (!ownerRestaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      restaurantId = ownerRestaurant._id;
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
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
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// DELETE FOOD
router.delete("/:id", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await food.deleteOne();
    res.json({ message: "Food deleted" });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// TOGGLE
router.put("/:id/toggle", authMiddleware, ownerMiddleware, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    res.json(food);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;