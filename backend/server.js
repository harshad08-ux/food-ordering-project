const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api", require("./routes/protectedRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/foods", require("./routes/foodRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});