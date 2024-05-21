import express from "express";
const Reviewrouter = express.Router();
import verifyToken from "../Middleware/UserAuth.js";
import {
  addReview,
  updateReview,
  getPackageReviews,
  deleteReview,
} from "../Contoller/Reviewcontroler.js";

Reviewrouter.use(verifyToken);
Reviewrouter.post("/reviews", addReview);
Reviewrouter.put("/reviews/:reviewId", updateReview);
Reviewrouter.get("/packages/:packageId/reviews", getPackageReviews);
Reviewrouter.delete("/reviews/:reviewId", deleteReview);

export default Reviewrouter;
