import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.App_Email,
        pass: process.env.App_Password,
      },
    });

    const mailOptions = {
      from: process.env.App_Email,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP for verification is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent:", info.response);
    return true; 
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false; 
  }
};
