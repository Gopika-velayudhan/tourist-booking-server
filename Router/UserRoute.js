import express from "express";
const Userrouter = express.Router();
import {
  userRegister,
  userLogin,
  Wishlist,
  showwishlist,
  categoryparams,
  packagebyid,
  deletewishlist,
  searchPackages,
  // Verifypayment,
  singleUser,
  // Order,
  Payment,
  createBooking,
  getBookingDetails,
  getAllBookings

  
} from "../Contoller/usercontoler.js";
import {sendEmailToUser} from '../nodemailer/Nodemailer.js'

import verifyToken from "../Middleware/UserAuth.js";


Userrouter

  // .post("/sendotp", sendOTP)
  //   .post("/verifyotp", verifyOTP)
  .post("/userRegister", userRegister)
  .post("/login", userLogin)
  .get("/packages", categoryparams)
  .get("/searches", searchPackages)
  .use(verifyToken)
  
  .get("/packages/:id", packagebyid)
  .post("/wishlists/:id", Wishlist)
  .get("/wishlists/:id", showwishlist)
  .delete("/wishlists/:id", deletewishlist)
  .get("/searches", searchPackages)
  .get('/users/:userid',singleUser)
  // .post("/orders",Order)
  //  .post("/verifypayment",Verifypayment)
  .post("/payment",Payment)
  .post('/bookings',createBooking)
  .get('/bookings/:id',getBookingDetails)
  .get('/bookings',getAllBookings)
 .post('/mail',sendEmailToUser)
  
  

export default Userrouter;
