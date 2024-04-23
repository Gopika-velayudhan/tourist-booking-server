import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Twilio/Otp verification.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiUserSchema } from "../Model/validateSchema.js";
import Package from "../Model/PackageSchema.js";



export const userRegister = async (req, res, next) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { Username, email, Phonenumber, password } = value;

    console.log(email);

    
    const existingUser = await User.findOne({ Username: Username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already taken!",
      });
    }

    // Send OTP
    try {
      await sendOTP(req, res);
    } catch (error) {
      return next(error);
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Username: Username,
      email: email,
      Phonenumber: Phonenumber,
      Password: hashedPassword,
    });
    console.log(newUser)

    
    await newUser.save()

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const userLogin = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    res.json(error.message);
  }

  const { email, password } = value;
  try {
    const validUser = await User.findOne({ email });
    console.log(email);

    if (!validUser) {
      return next(trycatchmidddleware(404, "User not found"));
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
export const userProfile = async (req,res,next)=>{
    
}
export const viewallpackage = async (req, res, next) => {
  try {
    const product = await Package.find();
    if (!product) {
      return next(trycatchmidddleware(404, "package  not found"));
    }
    res.status(200).json({
      status: "Success",
      message: "successfully product fetched",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};



export const categoryPackageView = async (req, res,next) => {
  const { category } = req.body;

  try {
    
    const packages = await Package.find({ Category: category });

    if (!packages || packages.length === 0) {
      return next(trycatchmidddleware(404,"package not found"))
    }

    res.status(200).json({
      status: "success",
      message: "Packages retrieved successfully",
      data: packages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    next(error)
   
    };
  }
  