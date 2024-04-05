import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Twilio/Otp verification.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiUserSchema } from "../Model/validateSchema.js";
import { verifyOTP } from "../Twilio/Otp verification.js";

export const userRegister = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);
  const { Username, Email, Phonenumber, Password } = value;
  const existingUser = await User.findOne({ Username: Username });

  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message: "User with this name already exists",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Username,
      Email,
      Phonenumber,
      Password: hashedPassword,
    });

    try {
      await sendOTP(req, res);
    } catch (error) {
      next(error);
    }

    // const verificationResult = await verifyOTP({ Phonenumber, OTP });

    // if (!verificationResult.success) {
    //   return res.status(400).json({
    //     status: "error",
    //     message: "Invalid OTP",
    //   });
    // }

    await newUser.save();

    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    res.json(error.message);
  }

  const { Email, Password } = value;
  try {
    const validUser = await User.findOne({ Email });
  
    if (!validUser) {
      return next(trycatchmidddleware(404, "User not found"));
    }
    const validPassword = await bcrypt.compare(Password, validUser.Password);
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
