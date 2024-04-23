import Package from "../Model/PackageSchema.js";
import User from "../Model/UserSchema.js";
import Jwt from "jsonwebtoken";

import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiPackageSchema } from "../Model/validateSchema.js";

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
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

export const allUser = async (req, res,next) => {
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
  const { value, error } = await joiPackageSchema.validate(req.body);
  
  
  
  if (error) {
    return next(trycatchmidddleware(400, error.message));
  } else {
    await Package.create({
     ...value
    });
    res.status(200).json({
      status: "Success",
      message: "package created successfully",
    });
  }
};
