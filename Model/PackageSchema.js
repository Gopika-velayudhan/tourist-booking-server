
import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  Destination: {
    type: String,
    
  },
  Duration: {
    type: Number,
    
  },
  Category: {
    type: String,
    
  },
  Price: {
    type: Number,
  },
  Available_Date: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: {
          type: [Number],
          required: true,
        },
      },
    ],
    required: true,
  },
  Image: {
    type: String,
  },
  Description: {
    type: String,
  },

}, { timestamps: true });

export default mongoose.model("Package", packageSchema);
