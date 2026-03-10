const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Food = require("../models/Food");
const authMiddleware = require("../middleware/authMiddleware");

// ADD REVIEW
router.post("/", authMiddleware, async (req, res) => {

  try {

    const { foodId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      food: foodId,
      rating,
      comment
    });

    await review.save();

    // update food rating
    const reviews = await Review.find({ food: foodId });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      reviews.length;

    await Food.findByIdAndUpdate(foodId, {
      rating: avgRating,
      numReviews: reviews.length
    });

    res.json({ message: "Review added" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;