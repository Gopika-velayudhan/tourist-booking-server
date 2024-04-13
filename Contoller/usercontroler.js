import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../Twilio/Otp verification.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiUserSchema, joiPackageSchema } from "../Model/validateSchema.js";
import Package from "../Model/PackageSchema.js";

// import { verifyOTP } from "../Twilio/Otp verification.js";

// export const otpSend = async (req, res, next) => {

//   try {

//   const { value, error } = joiUserSchema.validate(req.body);
//   const { Username, Email, Phonenumber, Password } = value;
//   const existingUser = await User.findOne({ Username: Username });

//   if (existingUser) {
//     return res.status(400).json({
//       status: "error",
//       message: "User with this name already exists",
//     });
//   }

//       const otpSend=await sendOTP(Phonenumber)
//       if(otpSend.success==true){

//         res.status(200).json({ success: true, message: "OTP request sent successfully" });
//       }

//     } catch (error) {
//       // if(error){
//       //   return res.status(500).json({ success: false, message: "something went wrong " });
//       // }
//       next(error);
//     }

// };

// export const userRegister = async (req, res, next) => {
//   const { value, error } = joiUserSchema.validate(req.body);

//   const { Username, Email, Phonenumber, Password, otp } = value;
//   const hashedPassword = await bcrypt.hash(Password, 10);
//   // add otp in joy like otp:Joi.number()
//   console.log(req.body,"sdfghjk");
//   try {
//     const otpVerify = await verifyOTP(Phonenumber, otp);

//     if (otpVerify && otpVerify.success == true) {
//       console.log("hi");

//       console.log("hi2");
//       const newUser = new User({
//         Username: Username,
//         Email: Email,
//         Phonenumber: Phonenumber,
//         Password: hashedPassword,
//       });
//       await newUser.save();
//       console.log("hi3");
//       return res.status(201).json({
//         success: true,
//         message: "user created successfully",
//       });
//     }

//    else if (otpVerify && otpVerify.success == false) {
//       return res.status(403).json({
//         message: "invalid OTP",
//       });
//     }
//     else {
//           console.log("hy");
//     }
//   } catch (error) {
//     // Handle errors here
//     next(error);
//   }
// };
// export const userRegister = async (req, res, next) => {
//   try {
//     const { value, error } = joiUserSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         status: "error",
//         message: error.details[0].message,
//       });
//     }

//     const { Username, Email, Phonenumber, Password } = value;

//     // checking existence
//     const existinguser = await User.findOne({ Username: Username });
//     if (existinguser) {
//       res.status(400).json({
//         status: "error",
//         message: "username already exist",
//       });
//     }

//     // otp sending

//     try {
//       await sendOTP(req, res);

//       await newUser.save();
//       res.status(201).json("user created successfully");
//     } catch (error) {
//       next(error);
//     }
//     // password hashing

//     const hashedpassword = await bcrypt.hash(Password, 10);

//     // user creation

//     const userData = await User.create({
//       Username: Username,
//       Email: Email,
//       Phonenumber: Phonenumber,
//       Password: hashedpassword,
//     });

//     // success response
//     return res.status(200).json({
//       status: "success",
//       message: "user registered successfully",
//       data: userData,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: "error",
//       message: "an unexpected error occured",
//     });
//   }
// };
export const userRegister = async (req, res, next) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { Username, Email, Phonenumber, Password } = value;

    // Check username already exists
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
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      Username: Username,
      Email: Email,
      Phonenumber: Phonenumber,
      Password: hashedPassword,
    });

    // Save new user to database
    await newUser.save();

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
