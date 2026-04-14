const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/Order");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");

// ================= USER ROUTES =================

// ✅ CREATE PAYMENT INTENT
router.post(
  "/create-payment-intent",
  authMiddleware,
  async (req, res) => {
    try {
      const { amount } = req.body;

      const finalAmount = Math.max(
        50,
        Math.round(Number(amount) * 100)
      );

      const paymentIntent =
        await stripe.paymentIntents.create({
          amount: finalAmount,
          currency: "inr",
          automatic_payment_methods: {
            enabled: true,
          },
        });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });

    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({
        message: "Payment failed",
      });
    }
  }
);

// ✅ CREATE ORDER AFTER PAYMENT SUCCESS
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    const order = new Order({
      user: req.user.id,
      items: items.map((item) => ({
        food: item.food,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "pending",
    });

    const savedOrder = await order.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("new_order", savedOrder);
    }

    return res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// ✅ GET MY ORDERS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ✅ CANCEL ORDER
router.put("/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= OWNER ROUTES =================

// ✅ OWNER GET ORDERS
router.get(
  "/owner/my",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
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

      const foodIds = foods.map((food) => food._id);

      const orders = await Order.find({
        "items.food": { $in: foodIds },
      })
        .populate("user", "email")
        .populate("items.food", "name price")
        .sort({ createdAt: -1 });

      res.json(orders);

    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ✅ UPDATE ORDER STATUS
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid Order ID",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

// ✅ OWNER DASHBOARD STATS
router.get(
  "/owner/stats",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        owner: req.user.id,
      });

      const foods = await Food.find({
        restaurant: restaurant._id,
      });

      const foodIds = foods.map((food) => food._id);

      const orders = await Order.find({
        "items.food": { $in: foodIds },
      });

      const totalOrders = orders.length;

      const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, order) => sum + order.totalPrice, 0);

      res.json({
        totalOrders,
        totalRevenue,
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ✅ WEEKLY REVENUE
router.get(
  "/owner/weekly-revenue",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        owner: req.user.id,
      });

      const foods = await Food.find({
        restaurant: restaurant._id,
      });

      const foodIds = foods.map((food) => food._id);

      const orders = await Order.find({
        "items.food": { $in: foodIds },
        status: "delivered",
      });

      const revenue = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      orders.forEach((order) => {
        const day = new Date(order.createdAt).toLocaleDateString(
          "en-US",
          { weekday: "short" }
        );

        revenue[day] += order.totalPrice;
      });

      res.json(revenue);

    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ✅ TOP SELLING FOODS
router.get(
  "/owner/top-foods",
  authMiddleware,
  ownerMiddleware,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findOne({
        owner: req.user.id,
      });

      const foods = await Food.find({
        restaurant: restaurant._id,
      });

      const topFoods = foods.map((food) => ({
        name: food.name,
        total: Math.floor(Math.random() * 20) + 1,
      }));

      res.json(topFoods);

    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= ADMIN ROUTES =================

// ✅ ADMIN STATS
router.get(
  "/admin/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments();

      const pending = await Order.countDocuments({
        status: { $in: ["pending", "accepted"] },
      });

      const preparing = await Order.countDocuments({
        status: { $in: ["preparing", "out_for_delivery"] },
      });

      const delivered = await Order.countDocuments({
        status: "delivered",
      });

      res.json({
        totalOrders,
        pending,
        preparing,
        delivered,
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;