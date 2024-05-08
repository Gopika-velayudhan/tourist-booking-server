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
} from "../Contoller/usercontroler.js";

import verifyToken from "../Middleware/UserAuth.js";

Userrouter

  // .post("/sendotp", sendOTP)
  //   .post("/verifyotp", verifyOTP)
  .post("/userRegister", userRegister)
  .post("/login", userLogin)
  .use(verifyToken)
  .get("/packages", categoryparams)
  .get("/packages/:id",packagebyid)
  .post("/wishlists/:id", Wishlist)
  .get("/wishlists/:id", showwishlist)
  .delete("/wishlists/:id",deletewishlist)

  

export default Userrouter;
