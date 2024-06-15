import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    Destination: {
      type: String,
      required: true,
    },
    Duration: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Available_Date: {
      type: Date,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    Description: {
      type: String,
      required: false,
    },
    reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    overallRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
export default mongoose.model("packages", PackageSchema);
