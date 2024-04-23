import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    Destination: String,
    Duration: Number,
    Category: String,
    Price: Number,
    Available_Date: Date,
    image: String, 
    Description: String,
  },
  { timestamps: true }
);
export default mongoose.model("Package",packageSchema)