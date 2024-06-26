import User from "../Model/UserSchema.js";
import Booking from "../Model/BookingSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiUserSchema } from "../Model/validateSchema.js";
import Package from "../Model/PackageSchema.js";
import Razorpay from "razorpay";
import { sendEmailToUser } from "../utility/Nodemailer.js";

import dotenv from "dotenv";
import { joiLoginSchema } from "../Model/validateSchema.js";
dotenv.config();

import { sendOTP } from "./../utility/Verification.js";

const otpStore = new Map();

export const userRegister = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);
  if (error) {
    return next(trycatchmidddleware(400, "Invalid input data"));
  }

  const { Username, email, password, Phonenumber } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ Username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already registered." });
    }

    const otp = await sendOTP(email);
    otpStore.set(email, { otp, timestamp: Date.now() });

    const userData = {
      Username,
      email,
      Phonenumber,
      password: hashedPassword,
    };
    otpStore.set(`${email}_data`, userData);

    res.status(200).json({
      status: "Success",
      message: "OTP sent to email. Please verify.",
    });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const storedOtpData = otpStore.get(email);
  const userData = otpStore.get(`${email}_data`);

  if (
    !storedOtpData ||
    storedOtpData.otp !== otp ||
    Date.now() - storedOtpData.timestamp > 10 * 60 * 1000
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP." });
  }

  try {
    const newUser = new User(userData);
    await newUser.save();

    otpStore.delete(email);
    otpStore.delete(`${email}_data`);

    res.status(201).json({
      status: "Success",
      message: "User successfully registered.",
      data: newUser,
    });
  } catch (err) {
    console.error("Error during OTP verification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userLogin = async (req, res, next) => {
  const { value, error } = joiLoginSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, error.message));
  }

  const { email, password } = value;
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(trycatchmidddleware(404, "User not found"));
    }
    if (validUser.isBlocked) {
      return res.status(403).json({
        status: "error",
        message: "User is blocked",
      });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(trycatchmidddleware(401, "Incorrect password"));
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.User_ACCESS_ToKEN_SECRT
    );
    res.status(200).json({ token, user: validUser });
  } catch (error) {
    next(error);
  }
};

export const categoryparams = async (req, res, next) => {
  try {
    const { Category } = req.query;

    const query = Category ? { Category } : {};

    const packages = await Package.find(query);

    if (!packages || packages.length === 0) {
      return next(
        trycatchmidddleware(404, "No packages found for the specified category")
      );
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully fetched packages",
      data: packages,
    });
  } catch (error) {
    next(error);
  }
};

export const viewallpackage1 = async (req, res, next) => {
  try {
    const packages = await Package.find();
    if (packages) {
      res.status(200).json({
        status: "Success",
        message: "successfully package fetched",
        data: packages,
      });
    } else {
      next(trycatchmidddleware(404, "package not found"));
    }
  } catch (err) {
    next(err);
  }
};
export const packagebyid = async (req, res, next) => {
  const packageid = req.params.id;
  try {
    const pack = await Package.findById(packageid);
    if (pack) {
      return res.status(200).json({
        status: "success",
        message: "package is fetched successful",
        data: pack,
      });
    }
    return next(trycatchmidddleware(404, "package not found"));
  } catch (err) {
    next(err);
  }
};
export const Wishlist = async (req, res, next) => {
  const userid = req.params.id;
  if (!userid) {
    return next(trycatchmidddleware(404, "user not found"));
  }

  try {
    const { packageid } = req.body;
    const user = await User.findById(userid);
    if (!user) {
      return next(trycatchmidddleware(404, "user not found"));
    }

    const findpack = await User.findOne({ _id: userid, wishlist: packageid });
    if (findpack) {
      return next(
        trycatchmidddleware(404, "the package already exists in wishlist")
      );
    }

    const updatewishlist = await User.updateOne(
      { _id: userid },
      { $push: { wishlist: packageid } }
    );

    return res.status(201).send({
      status: "Success",
      message: "successfully added package in wishlist",
      data: updatewishlist,
    });
  } catch (err) {
    return next(err);
  }
};

export const showwishlist = async (req, res, next) => {
  const userid = req.params.id;
  try {
    const user = await User.findById(userid);

    if (!user) {
      return next(trycatchmidddleware(404, "User not found"));
    }

    const wishlistpack = user.wishlist;
    const allwishCount = wishlistpack.length;

    if (allwishCount === 0) {
      return res.status(200).json({
        status: "success",
        message: "Wishlist is empty",
        data: [],
        datacount: allwishCount,
      });
    }

    const wishpack = await Package.find({ _id: { $in: wishlistpack } });

    res.status(200).json({
      status: "success",
      message: "Wishlist packages fetched successfully",
      data: wishpack,
      datacount: allwishCount,
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    next(err);
  }
};

export const deletewishlist = async (req, res, next) => {
  const userid = req.params.id;
  if (!userid) {
    return next(trycatchmidddleware(404, "user not found"));
  }

  try {
    const { packageid } = req.body;
    if (!packageid) {
      return next(trycatchmidddleware(404, "package not found"));
    }

    const user = await User.findById(userid);
    if (!user) {
      return next(trycatchmidddleware(404, "user not found"));
    }

    await User.updateOne({ _id: userid }, { $pull: { wishlist: packageid } });

    return res.status(200).json({
      status: "success",
      message: "successfully deleted package",
    });
  } catch (err) {
    return next(err);
  }
};

export const searchPackages = async (req, res, next) => {
  try {
    const { location, duration, price } = req.query;

    let query = {};

    if (location) {
      query.Destination = { $regex: new RegExp(location, "i") };
    }
    if (duration) {
      query.Duration = Number(duration);
    }
    if (price) {
      query.Price = Number(price);
    }

    const packs = await Package.find(query);

    if (packs.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No packages found for the specified criteria",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fetched packages available for the specified criteria",
      data: packs,
    });
  } catch (error) {
    next(error);
  }
};

export const singleUser = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await User.findById(userid);
    if (user) {
      res.status(200).json({
        status: "success",
        message: "user fetched by id",
        data: user,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const Payment = async (req, res, next) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const { email, amount, currency, receipt } = req.body;

  if (!email || !amount || !currency || !receipt) {
    console.error("Missing parameters in request body", req.body);
    return res.status(400).json({
      status: "error",
      message: "Missing required parameters",
    });
  }

  try {
    const payment = await razorpay.orders.create({ amount, currency, receipt });

    await sendEmailToUser(amount, currency, receipt, email);

    res.json({
      status: "success",
      message: "Payment initiated",
      data: payment,
    });
  } catch (error) {
    console.error("Error in Payment processing:", error);
    next(new Error(error.message));
  }
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createBooking = async (req, res, next) => {
  const { userId, packageId, amount, currency } = req.body;

  try {
    const payment = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    const booking = new Booking({
      user: userId,
      package: packageId,
      payment_id: payment.id,
      total_amount: amount,
    });

    await booking.save();

    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      data: booking,
      payment_id: payment.id,
    });
  } catch (error) {
    console.error(error);
    next(new Error(error.message));
  }
};

export const getBookingDetails = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id)
      .populate("user")
      .populate("package");

    if (!booking) {
      return next(trycatchmidddleware(404, "Booking not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Booking details fetched successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    next(trycatchmidddleware(error.message));
  }
};

export const deleteBooking = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return next(trycatchmidddleware(404, "Booking not found"));
    }

    booking.isDeleted = true;
    await booking.save();

    res.status(200).json({
      status: "success",
      message: "Booking deleted successfully",
      data: booking,
    });
  } catch (error) {
    console.log(error);
    next(trycatchmidddleware(error.message));
  }
};

export const createProfile = async (req, res, next) => {
  const { userId } = req.params;
  const { value, error } = joiUserSchema.validate(req.body);

  try {
    if (error) {
      return next(trycatchmidddleware(400, "Validation error"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return next(trycatchmidddleware(404, "User not found"));
    }

    user.profile = value;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};

export const updateuser = async (req, res, next) => {
  try {
    const { Username, email, Phonenumber, Profileimg } = req.body;
    const { id } = req.params;

    const update = await User.findByIdAndUpdate(
      id,
      { $set: { Username, email, Phonenumber, Profileimg } },
      { new: true }
    );

    if (update) {
      return res.status(200).json({
        status: "success",
        message: "Successfully updated data",
        data: update,
      });
    } else {
      return next(trycatchmidddleware(404, 'User not found'));
    }
  } catch (error) {
    return next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      next(trycatchmidddleware(404, "user not found"));
    }
    await User.deleteOne({ _id: id });
    return res.status(200).json({
      status: "success",
      message: "suucessfully deleted user",
    });
  } catch (err) {
    next(err);
  }
};
