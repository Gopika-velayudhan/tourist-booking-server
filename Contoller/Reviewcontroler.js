import  {joiReviewSchema}  from "../Model/validateSchema.js";
import User from "../Model/UserSchema.js";
import Package from "../Model/PackageSchema.js";
import Booking from "../Model/BookingSchema.js";
import Review from "../Model/Reviewschema.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";

export const addReview = async (req, res, next) => {
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, error.message));
  }

  const { user, package: packageId, rating, reviewText } = value;

  try {
    const existingUser = await User.findById(user)
    const existingPackage = await Package.findById(packageId);

    if (!existingUser) {
      return next(trycatchmidddleware(404, "User not found"));
    }

    if (!existingPackage) {
      return next(trycatchmidddleware(404, "Package not found"));
    }

    

    const newReview = new Review({
      user,
      package: packageId,
      rating,
      reviewText,
    });

    await newReview.save();

    if (!existingUser.reviews) {
      existingUser.reviews = [];
    }

    existingUser.reviews.push(newReview._id);
    await existingUser.save();

    return res.status(201).json({
      status: "success",
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};


export const getPackageReviews = async (req, res) => {
  const { packageId } = req.params;

  try {
    
    const reviewCount = await Review.countDocuments({ package: packageId });

    
    const reviewDocs = await Review.find({ package: packageId }).populate(
      'user',
      'Username Profileimg email'
    );

    if (!reviewDocs || reviewDocs.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No reviews for this package',
        data: [],
        dataCount: reviewCount,
        overallRating: 0,
      });
    }

  
    const totalRating = reviewDocs.reduce((acc, review) => acc + review.rating, 0);
    const overallRating = totalRating / reviewCount;


    await Package.findByIdAndUpdate(packageId, { overallRating });

    return res.status(200).json({
      status: 'success',
      message: 'Fetched reviews of this property',
      data: reviewDocs,
      dataCount: reviewCount,
      overallRating: overallRating.toFixed(1),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
