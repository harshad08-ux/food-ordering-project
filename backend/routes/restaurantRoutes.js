const express = require("express");
const router = express.Router();
const ownerMiddleware = require("../middleware/ownerMiddleware");
const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

/**
 * 🛠 CREATE RESTAURANT (OWNER)
 */
router.post(
  "/",
  authMiddleware,
  ownerMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, address, cuisine, isOpen } = req.body;

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
        address,
        cuisine,
        isOpen,
        owner: req.user.id,
        approvalStatus: "pending",
        image: req.file
          ? `http://localhost:5000/uploads/${req.file.filename}`
          : "",
      });

      const savedRestaurant = await restaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to create restaurant",
      });
    }
  }
);

/**
 * 🏪 GET MY RESTAURANT (OWNER)
 */
router.get("/owner/my", authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "No restaurant found",
      });
    }

    if (restaurant.approvalStatus === "pending") {
      return res.status(403).json({
        message: "Your restaurant is pending admin approval",
      });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * ✏️ UPDATE RESTAURANT (OWNER)
 * used for restaurant image update
 */
router.put(
  "/:id",
  authMiddleware,
  ownerMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      if (restaurant.owner.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      if (req.file) {
        restaurant.image = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      if (req.body.name) restaurant.name = req.body.name;
      if (req.body.address) restaurant.address = req.body.address;
      if (req.body.cuisine) restaurant.cuisine = req.body.cuisine;
      if (req.body.isOpen !== undefined)
        restaurant.isOpen = req.body.isOpen;

      await restaurant.save();

      res.json({
        message: "Restaurant updated successfully",
        restaurant,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to update restaurant",
      });
    }
  }
);

/**
 * 🍽 GET ALL RESTAURANTS (PUBLIC / USER)
 */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      $or: [
        { approvalStatus: "approved" },
        { approvalStatus: { $exists: false } },
      ],
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

/**
 * ⏳ PENDING RESTAURANTS (ADMIN)
 */
router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const restaurants = await Restaurant.find({
        approvalStatus: "pending",
      }).populate("owner", "name email");

      res.json(restaurants);
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

/**
 * ✅ APPROVE / REJECT
 */
router.put(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const restaurant = await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      restaurant.approvalStatus = status;
      await restaurant.save();

      res.json({
        message: `Restaurant ${status}`,
        restaurant,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;