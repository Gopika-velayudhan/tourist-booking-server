import nodemailer from "nodemailer";

export const sendEmailToUser = async (amount, currency, receipt, email) => {
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
    to: email,
    subject: "Booking Confirmation",
    html: `<h4>Dear Customer,</h4>
           <p>This is to acknowledge the details of your package booking.</p>
           <p><b>Amount:</b> ${amount} ${currency}</p>
           <p><b>Receipt:</b> ${receipt}</p>
           <p>Thank you for your booking. If you have any issues, please contact our support team.</p>`,
  };

  try {
    
    await transporter.sendMail(mailOptions);
    
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
