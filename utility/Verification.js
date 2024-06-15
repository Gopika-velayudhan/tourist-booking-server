import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.App_Email,
    pass: process.env.App_Password,
  },
});

export const sendOTP = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString();

  const mailOptions = {
    from: process.env.App_Email,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `<b>Your OTP code is ${otp}</b>`,
  };

  await transporter.sendMail(mailOptions);

  return otp;
};
