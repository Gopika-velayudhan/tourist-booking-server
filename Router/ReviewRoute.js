import express from "express";
const Reviewrouter = express.Router();
import verifyToken from "../Middleware/UserAuth.js";
import { addReview, getPackageReviews } from "../Contoller/Reviewcontroler.js";
    ``
Reviewrouter.use(verifyToken);
Reviewrouter.post("/reviews", addReview);

Reviewrouter.get("/packages/:packageId/reviews", getPackageReviews);

export default Reviewrouter;
