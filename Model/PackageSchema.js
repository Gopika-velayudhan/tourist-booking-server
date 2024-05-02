
import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
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
    required: true
      
  },
  images: [{
    type: String,
    required: true,
   }],
  Description: {
    type: String,
    required: true,
  },
});
export default mongoose.model("packages", PackageSchema);
