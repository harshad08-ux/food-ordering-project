const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

// TEMP simple route to test
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile fetched successfully",
    user: req.user
  });
});

module.exports = router;
