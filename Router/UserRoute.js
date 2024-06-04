
import express from "express";
import {
  userRegister,
  userLogin,
  Wishlist,
  showwishlist,
  categoryparams,
  packagebyid,
  deletewishlist,
  searchPackages,
  singleUser,
  Payment,
  createBooking,
  getBookingDetails,
  deleteBooking,
  updateuser,
  deleteAccount,
  viewallpackage1
} from '../Contoller/usercontoler.js';
import { sendEmail } from '../nodemailer/Nodemailer1.js'
import uploadSingleImage from "../ImageUpload/Imageupload1.js";
import verifyToken from "../Middleware/UserAuth.js";

const Userrouter = express.Router();

Userrouter
  .post("/userRegister", userRegister)
  .post("/login", userLogin)
  .get("/packages", categoryparams)
  .get("/searches", searchPackages)
  .use(verifyToken)
  .get("/packages/:id", packagebyid)
  .post("/wishlists/:id", Wishlist)
  .get("/wishlists/:id", showwishlist)
  .delete("/wishlists/:id", deletewishlist)
  .get("/users/:userid", singleUser)
  .post("/payment", Payment)
  .post("/bookings", createBooking)
  .get("/bookings/:id", getBookingDetails)
  .delete("/bookings/:id", deleteBooking)
  .put("/users/:id", uploadSingleImage, updateuser)
  .delete("/users/:id", deleteAccount)
  .post("/send-email", sendEmail)
  .get("/getpackages",viewallpackage1)

export default Userrouter;
