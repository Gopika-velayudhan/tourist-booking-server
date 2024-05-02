import express from "express";
const Userrouter = express.Router();
import {
  userRegister,
  userLogin,
  viewallpackage,
} from "../Contoller/usercontroler.js";
import { sendOTP, verifyOTP } from "../Twilio/Otp verification.js";
import verifyToken from "../Middleware/UserAuth.js";

Userrouter.post("/sendotp", sendOTP)
  .post("/verifyotp", verifyOTP)
  .post("/userRegister", userRegister)
  .post("/login", userLogin)
  .use(verifyToken)
  .get("/packages", viewallpackage);

export default Userrouter;
