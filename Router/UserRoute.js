import express from "express";
const Userrouter = express.Router();

import { userRegister } from "../Contoller/usercontroler.js";
import { sendOTP } from "../Twilio/Otp verification.js";
import { userLogin } from "../Contoller/usercontroler.js";
import { verifyOTP } from "../Twilio/Otp verification.js";


Userrouter
  .post("/register", userRegister)
  .post("/sendotp", sendOTP)
  .post("/verifyOtp",verifyOTP)
  .post("/login", userLogin);

export default Userrouter;
