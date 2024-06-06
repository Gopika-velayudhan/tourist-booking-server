import nodemailer from "nodemailer";

export const sendEmailToUser = async (amount, currency, receipt) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, 
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: "gopikakv627@gmail.com",
    subject: `Booking confirm`,
    html: `<h4>Dear Customer,</h4>
           <p>This is to acknowledge mail to the details of your package booking details</p>
           <p>Thank you for your Booking. If you have any Issues, contact the Admin agent.</p>
          `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
