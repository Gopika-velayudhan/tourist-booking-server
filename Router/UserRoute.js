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
  // verifyPayment,
  singleUser,
  // Order
  Payment
  
} from "../Contoller/usercontoler.js";

import verifyToken from "../Middleware/UserAuth.js";


Userrouter

  // .post("/sendotp", sendOTP)
  //   .post("/verifyotp", verifyOTP)
  .post("/userRegister", userRegister)
  .post("/login", userLogin)
  .use(verifyToken)
  .get("/packages", categoryparams)
  .get("/packages/:id", packagebyid)
  .post("/wishlists/:id", Wishlist)
  .get("/wishlists/:id", showwishlist)
  .delete("/wishlists/:id", deletewishlist)
  .get("/searches", searchPackages)
  .get('/users/:userid',singleUser)
  // .post("/orders",Order)
  // .post("/verifypayment",verifyPayment)
  .post("/payment",Payment)
 
  
  

export default Userrouter;
