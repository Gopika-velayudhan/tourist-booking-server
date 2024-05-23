import nodemailer from "nodemailer";

export const sendEmailToUser = async (user) => {
  console.log(user, "this is from nodemailer");

  const email = user;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    requireTLS: true,
    logger: true,
  });

  const info = await transporter.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: `Booking comfirm`,
    html: `<h4>Dear Customer,</h4>
        <p>This is to acknowledge mail to the details of your package booking details</p>
        
        
        <p>Thank you for your Booking. If you have any Issues, contact the website.</p>
       
        `,

    headers: { "x-myheader": "test header" },
  });

  if (info.accepted.includes(email)) return true;
  else return false;
};
