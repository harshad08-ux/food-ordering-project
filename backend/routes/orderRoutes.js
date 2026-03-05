const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");


// ================= USER ROUTES =================

// CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {

    const { items, totalPrice } = req.body;

    const order = new Order({
      user: req.user.id,
      items: items.map((item) => ({
        food: item.food,
        quantity: item.quantity
      })),
      totalPrice,
      status: "pending"
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET MY ORDERS
router.get("/my", authMiddleware, async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user.id })
      .populate("items.food", "name price restaurant")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= ADMIN ROUTES =================

// GET ALL ORDERS
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.food", "name price restaurant")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= OWNER ROUTES =================

// GET OWNER ORDERS
router.get("/owner/my", authMiddleware, ownerMiddleware, async (req, res) => {

  try {

    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find()
      .populate("user", "email")
      .populate("items.food", "name price restaurant");

    const ownerOrders = orders.filter(order =>
      order.items.some(item =>
        item.food?.restaurant?.toString() === restaurant._id.toString()
      )
    );

    res.json(ownerOrders);

  } catch (error) {
    console.error("Owner orders error:", error);
    res.status(500).json({ message: "Server error" });
  }

});
// OWNER DASHBOARD STATS
router.get("/owner/stats", authMiddleware, ownerMiddleware, async (req, res) => {
  try {

    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const foods = await Food.find({ restaurant: restaurant._id });
    const foodIds = foods.map(f => f._id);

    const orders = await Order.find({
      "items.food": { $in: foodIds }
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status === "delivered") {
        return sum + order.totalPrice;
      }
      return sum;
    }, 0);

    res.json({
      totalOrders,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE ORDER STATUS =================

router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    await order.save();

    res.json(order);

  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;