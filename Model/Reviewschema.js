import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  package: { type: mongoose.Schema.ObjectId, ref: "Package", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;