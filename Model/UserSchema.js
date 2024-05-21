import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Username: { type: String, required: true },
  email: { type: String, required: true },
  Phonenumber: { type: Number, required: true },
  password: { type: String, required: true },
  wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Package" }],
  isActive: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
