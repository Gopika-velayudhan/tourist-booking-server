import mongoose from "mongoose";
import User from "../Model/UserSchema.js";
import Package from "../Model/PackageSchema.js";  

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  package: { type: mongoose.Schema.ObjectId, ref: "packages", required: true },
  payment_id: String,
  total_amount: Number,
  date: { type: String, default: () => new Date().toLocaleDateString() },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
}, { timestamps: true });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
