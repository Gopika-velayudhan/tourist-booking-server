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
  .connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => { 
    console.error("MongoDB connection error:", err);
  });

const app = express();


app.use(cors({
  origin: "https://tourist-booking-client.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", Userrouter);
app.use("/api/admin", Adminrouter);
app.use("/api/review", Reviewrouter);


app.use((err, req, res, next) => {
  console.error("Error:", err); 
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const port = process.env.PORT || 3005; 


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
