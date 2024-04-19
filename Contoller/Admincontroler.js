import Package from "../Model/PackageSchema.js";
import User from "../Model/UserSchema.js";
import Jwt from "jsonwebtoken";
import { joiPackageSchema } from "../Model/validateSchema.js";

import { trycatchmidddleware } from "../Middleware/trycatch.js";

export const adminLogin = async (req, res) => {
  const { Email, Password } = req.body;
  console.log(req.body);
  try {
    if (
      Email === process.env.ADMIN_EMAIL &&
      Password === process.env.ADMIN_PASSWORD
    ) {
      const token = Jwt.sign(
        { Email: Email },
        process.env.ADMIN_ACCESS_TOKEN_SECRT
      );
      return res.status(200).send({
        status: "Success",
        mesage: "Admin Login Successful",
        data: token,
      });
    } else {
      return next(trycatchmidddleware(404, "admin not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const allUser = async (req, res) => {
  const allUser = await User.find();
  if (allUser.length === 0) {
    return next(trycatchmidddleware(404, "user not found"));
  } else {
    res.status(200).json({
      status: "Success",
      message: "successfully fetched all user",

      data: allUser,
    });
  }
};
export const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(trycatchmidddleware(404, "user not found"));
  }
  res.status(200).json({
    status: "success",
    message: "successfully fetched user",
    data: user,
  });
};

export const createPackage = async (req, res, next) => {
  const { error, value } = joiPackageSchema.validate(req.body);

  if (error) {
    console.error('Validation error:', error.details);
    return next(trycatchmidddleware(400, "Error in validation", error.details[0].message));
  }

  try {
    const newPackage = await Package.create(value);
    console.log('New package created:', newPackage);
    res.status(201).json({
      status: "Success",
      message: "Package created successfully",
      data: newPackage,
    });
  } catch (error) {
    console.error('Error creating package:', error);
    next(error);
  }
};
