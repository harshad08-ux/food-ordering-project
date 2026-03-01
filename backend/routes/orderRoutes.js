const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ================= USER ROUTES =================

// ✅ CREATE ORDER
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
    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET MY ORDERS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= ADMIN ROUTES =================

// ✅ GET ALL ORDERS (ADMIN)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.food", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= IMPORTANT: ROUTE ORDER MATTERS =================
// Specific route must come BEFORE generic /:id route


// ✅ CANCEL ORDER (USER)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status required" });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;