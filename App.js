import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import Userrouter from "./Router/UserRoute.js";
import Adminrouter from "./Router/AdminRoute.js";
import Reviewrouter from "./Router/ReviewRoute.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => { 
    console.log(err);
  });

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
  origin:"https://tourist-booking-client.vercel.app/"
}));
app.use(bodyParser.json());

const port = 3005;

app.use("/api/user", Userrouter);
app.use('/api/admin', Adminrouter);
app.use('/api/review', Reviewrouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
