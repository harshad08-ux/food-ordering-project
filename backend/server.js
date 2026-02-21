const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const protectedRoutes = require("./routes/protectedRoutes");
app.use("/api", protectedRoutes);


// ROUTES
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const foodRoutes = require("./routes/foodRoutes");
app.use("/api/foods", foodRoutes);


const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/api/restaurants", restaurantRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
