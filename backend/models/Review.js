const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food"
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);