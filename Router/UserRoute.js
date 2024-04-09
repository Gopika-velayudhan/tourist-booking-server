import express from "express";
const Userrouter = express.Router();
import { userRegister } from "../Contoller/usercontroler.js";
import { sendOTP } from "../Twilio/Otp verification.js";
import { verifyOtp } from "../Twilio/Otp verification.js";
import { userLogin } from "../Contoller/usercontroler.js";

Userrouter
  .post("/sendotp", sendOTP)
  .post("/verifyotp",verifyOtp)
  .post("/userRegister", userRegister)
  .post("/login", userLogin);

export default Userrouter;
