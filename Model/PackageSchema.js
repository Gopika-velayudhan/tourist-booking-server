import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  Destination: {
    type: String,
    required: true,
  },
  Duration: {
    type: Number,
    required: true,
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
});

export default mongoose.model("Package", packageSchema);
