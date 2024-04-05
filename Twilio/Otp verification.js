import twilio from "twilio";
import { configDotenv } from "dotenv";
configDotenv();
const accountSid = process.env.Account_SID;
const authToken = process.env.Auth_Token;
const serviceId = "VAf66661630fab62859f1150e83eef8ebc";
const client = twilio(accountSid, authToken);

// Controller for sending OTP
export const sendOTP = async (req, res) => {
  const { Phonenumber } = req.body;
  console.log(req.body);
  try {
    const verification = await client.verify.v2.services(serviceId).verifications.create({
      to: "+91" + Phonenumber,
      channel: "sms",
    });

    console.log("OTP request sent:", verification.sid);
    res.json({ success: true, message: "OTP request sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};
export const verifyOTP = async (req, res) => {
  const { Phonenumber, Code } = req.body;
  try {
    const verificationCheck = await client.verify.v2.services(serviceId).verificationChecks.create({
      to: "+91" + Phonenumber,
      code: Code,
    });

    console.log("OTP verification result:", verificationCheck.status);
    if (verificationCheck.status === "approved") {
      res.json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};
