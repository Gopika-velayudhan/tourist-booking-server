import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.App_Email,
    pass: process.env.App_Password,
  },
});

export const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  
  console.log("Received email request:", req.body);

  const mailOptions = {
    from: email,
    to: process.env.APP_EMAIL,
    subject: `Message from ${name}`,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send("Error sending email");
  }
};
