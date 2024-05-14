import User from "../Model/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { sendOTP } from "../Twilio/Otp verification.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiUserSchema } from "../Model/validateSchema.js";
import Package from "../Model/PackageSchema.js";
import algoliasearch from "algoliasearch";
import dotenv from "dotenv";
dotenv.config();
// const Admin_api = process.env.Admin_api;
// const App_id = process.env.App_id;
// const Index_name = process.env.Index_name;

// const algoliaClient = algoliasearch(App_id, Admin_api);
// const index = algoliaClient.initIndex(Index_name);

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
    // try {
    //   await sendOTP(req, res);
    // } catch (error) {
    //   return next(error);
    // }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Username: Username,
      email: email,
      Phonenumber: Phonenumber,
      password: hashedPassword,
    });
    console.log(newUser);

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
// export const sendOTP = async({email},res)=>{
//   try{
//     const transporter = nodemailer.createTransport({
//       service:'gmail',
//       host:'smtp.gmail.com',
//       port:465,
//       secure:true,
//       auth:{
//         user:process.env.ADMIN_EMAIL,
//         pass:'nodemailer'

//       }
//     });
//     otp = `${Math.floor(1000+Math.random()*9000)}`;
//     const maailOptions = {

//     }
//   }
// }

export const userLogin = async (req, res, next) => {
  const { value, error } = joiUserSchema.validate(req.body);

  if (error) {
    next(trycatchmidddleware(400, error.message));
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
        message: "user is blocked",
      });
    }
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(trycatchmidddleware(401, "Incorrect password"));
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.User_ACCESS_ToKEN_SECRT,
      // { expiresIn: 86400 }
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
  try {
    if (!userid) {
      next(trycatchmidddleware(404, "user not found"));
    }
    const { packageid } = req.body;
    const user = await User.findById(userid);
    if (!user) {
      next(trycatchmidddleware(404, "package not found"));
    }
    const findpack = await User.findOne({ _id: userid, wishlist: packageid });
    if (findpack) {
      next(trycatchmidddleware(404, "the package already exist in wishlist"));
    }
    const updatewishlist = await User.updateOne(
      { _id: userid },
      { $push: { wishlist: packageid } }
    );
    res.status(201).json({
      status: "Success",
      message: "successfully added package in wishlist",
      data: updatewishlist,
    });
  } catch (err) {
    next(err);
  }
};

export const showwishlist = async (req, res, next) => {
  const userid = req.params.id;
  try {
    const user = await User.findById(userid);
    if (!user) {
      next(trycatchmidddleware(404, "user not found"));
    }

    const wishlistpack = user.wishlist;
    if (wishlistpack.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Wishlist is empty",
        data: [],
      });
    }

    const wishpack = await Package.find({ _id: { $in: wishlistpack } });

    res.status(200).json({
      status: "success",
      message: "Wishlist packages fetched successfully",
      data: wishpack,
    });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    next(err);
  }
};

export const deletewishlist = async (req, res, next) => {
  const userid = req.params.id;
  try {
    const { packageid } = req.body;
    if (!packageid) {
      next(trycatchmidddleware(404, "package not found"));
    }
    const user = await User.findById(userid);
    if (!user) {
      return next(trycatchmidddleware(404, "user not fount"));
    }
    await User.updateOne({ _id: userid }, { $pull: { wishlist: packageid } });
    res.status(200).json({
      status: "success",
      message: "successfully delted package",
    });
  } catch (err) {
    next(err);
  }
};

export const searchPackages = async (req, res, next) => {
  try {
    const { Destination, Duration, Price } = req.query; 

    let query = {};

    if (Destination) {
      query.Destination = { $regex: new RegExp(Destination, "i") };
    }
    if (Duration) {
      query.Duration = Number(Duration)
    }
    if (Price) {
      query.Price = Number(Price); 
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



