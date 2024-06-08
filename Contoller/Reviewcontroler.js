import User from "../Model/UserSchema.js";
import Package from "../Model/PackageSchema.js";
import Review from "../Model/ReviewSchema.js";
import { joiReviewSchema } from "../Model/validateSchema.js";
import { trycatchmidddleware } from "../Middleware/trycatch.js";




export const addReview = async (req, res, next) => {
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, error.message));
  }

  const { user, package: packageId, rating, reviewText } = value;

  try {
    const existingUser = await User.findById(user).populate('bookings');
    const existingPackage = await Package.findById(packageId);

    if (!existingUser) {
      return next(trycatchmidddleware(404, "User not found"));
    }

    if (!existingPackage) {
      return next(trycatchmidddleware(404, "Package not found"));
    }

    const hasBookedPackage = existingUser.bookings.some(
      booking => booking.package.toString() === packageId
    );

    if (!hasBookedPackage) {
      return next(trycatchmidddleware(403, "You can only review a package you have booked"));
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

export const updateReview = async (req, res, next) => {
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return next(trycatchmidddleware(400, error.message));
  }

  const { reviewId } = req.params;
  const { user, package: packageId, rating, reviewText } = value;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return next(trycatchmidddleware(404, "Review not found"));
    }

    if (review.user.toString() !== user) {
      return next(
        trycatchmidddleware(403, "User not authorized to update this review")
      );
    }

    review.package = packageId;
    review.rating = rating;
    review.reviewText = reviewText;

    await review.save();

    return res.status(200).json({
      status: "success",
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const getPackageReviews = async (req, res, next) => {
  const { packageId } = req.params;

  try {
    const reviews = await Review.find({ package: packageId }).populate(
      "user",
      "Username email Profileimg "
    );

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No reviews found for this package",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Review not found",
      });
    }

    await Review.deleteOne({ _id: reviewId });

  

    return res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
