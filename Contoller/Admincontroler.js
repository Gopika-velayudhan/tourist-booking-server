import Package from "../Model/PackageSchema.js";
import User from "../Model/UserSchema.js";
import Jwt from "jsonwebtoken";
import Booking from "../Model/BookingSchema.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiPackageSchema } from "../Model/validateSchema.js";

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = Jwt.sign(
        { email: email },
        process.env.ADMIN_ACCESS_TOKEN_SECRT
      );
      return res.status(200).send({
        status: "Success",
        message: "Admin Login Successful",
        data: token,
      });
    } else {
      return res.status(404).send({
        status: "Failed",
        message: "Admin not found",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const allUser = async (req, res, next) => {
  try {
    const allUser = await User.find();
    const allUserCount = await User.countDocuments();

    if (allUser.length === 0) {
      return next(trycatchmidddleware(404, "user not found"));
    } else {
      res.status(200).json({
        status: "Success",
        message: "successfully fetched all user",

        data: allUser,
        dataCount: allUserCount,
      });
    }
  } catch (err) {
    next(err);
  }
};
export const 

getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(trycatchmidddleware(404, "user not found"));
    }
    res.status(200).json({
      status: "success",
      message: "successfully fetched user",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
export const createPackacge = async (req, res, next) => {
  const { value, error } = joiPackageSchema.validate(req.body);

  if (error) {
    next(trycatchmidddleware(400, error.message));
  }
  try {
    const newpack = await Package.create({
      ...value,
    });
    res.status(201).json({
      status: "success",
      message: "data created successfully",
      data: newpack,
    });
  } catch (err) {
    next(err);
  }
};
export const viewallpackage = async (req, res, next) => {
  try {
    const packages = await Package.find();
    const allpackagecount = await Package.countDocuments();

    if (packages) {
      res.status(200).json({
        status: "Success",
        message: "successfully package fetched",
        data: packages,
        datacount:allpackagecount
      });
    } else {
      a;
      next(trycatchmidddleware(404, "package not found"));
    }
  } catch (err) {
    next(err);
  }
};
export const SinglePackage = async (req, res, next) => {
  const packageid = req.params.id;

  try {
    const pack = await Package.findById(packageid);
    if (pack) {
      return res.status(200).json({
        status: "success",
        message: "successfyllt fetched single package",
        data: pack,
      });
    }
    return next(trycatchmidddleware(404, "package not found"));
  } catch (err) {
    next(err);
  }
};
export const updatepackages = async (req, res, next) => {
  try {
    const { value, error } = joiPackageSchema.validate(req.body);

    if (error) {
      next(trycatchmidddleware(400, error.message));
    }

    const { id } = req.params;
  

    const updatepackage = await Package.findByIdAndUpdate(
      id,
      { $set: { ...value } },
      { new: true }
    );
    if (updatepackage) {
      return res.status(200).json({
        status: "success",
        message: "Successfully updated data",
        data: updatepackage,
      });
    } else {
      return next(trycatchmidddleware(404, error.message));
    }
  } catch (error) {
    return next(error);
  }
};
export const deletepackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res
      .status(200)
      .json({ message: "Package deleted successfully", deletedPackage });
  } catch (err) {
    next(err);
  }
};

export const blockuser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.query.action;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "block" && user.isBlocked) {
      return res.status(400).json({ message: "User is already blocked" });
    } else if (action === "unblock" && !user.isBlocked) {
      return res.status(400).json({ message: "User is not blocked" });
    }

    user.isBlocked = action === "block";
    await user.save();

    const actionMessage = action === "block" ? "blocked" : "unblocked";
    res
      .status(200)
      .json({ message: `User ${actionMessage} successfully`, user });
  } catch (err) {
    next(err);
  }
};
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("user package");
    const allBookingCount = await Booking.countDocuments();

    if (bookings.length === 0) {
      return next(trycatchmidddleware(404, "No bookings found"));
    }

    res.status(200).json({
      status: "success",
      message: "All bookings fetched successfully",
      data: bookings,
      datacount:allBookingCount
    });
  } catch (error) {
    console.log(error);
    next(trycatchmidddleware(error.message));
  }
};
