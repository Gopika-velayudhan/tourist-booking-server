
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    email: { type: String, required: true },
    Phonenumber: { type: Number, required: true },
    password: { type: String, required: true },
    otp:{type:String},
    Profileimg:{type:String, default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"},
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Package" }],
    bookings:[{type: mongoose.Schema.ObjectId, ref :"Booking"}],
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    isVerified:{type:Boolean,default:false}
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
