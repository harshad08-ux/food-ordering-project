const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const mongoose = require("mongoose");

// ================= USER ROUTES =================

// ✅ CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    const order = new Order({
      user: req.user.id, // ✅ CORRECT
      items: items.map(item => ({
        food: item.food,
        quantity: item.quantity
      })),
      totalPrice
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET MY ORDERS (FIXED)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }) // 🔥 FIX
      .populate("items.food", "name price");

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN ROUTES =================

// GET ALL ORDERS (ADMIN)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE ORDER STATUS (ADMIN)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
