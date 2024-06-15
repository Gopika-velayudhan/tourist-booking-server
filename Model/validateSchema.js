import Joi from "joi";

export const joiUserSchema = Joi.object({
  Username: Joi.string(),
  email: Joi.string().email().required(),
  Phonenumber: Joi.number().integer().min(1000000000).required(),
  password: Joi.string().required(),
  Profileimg: Joi.string()
    .uri()
    .optional()
    .default(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    ),

  wishlist: Joi.array().items(Joi.string().hex().length(24)).optional(),
  bookings: Joi.array().items(Joi.string().hex().length(24)).optional(),
  isActive: Joi.boolean().optional().default(true),
  isBlocked: Joi.boolean().optional().default(false),
  reviews: Joi.array().items(Joi.string().hex().length(24)).optional(),
  isVerified: Joi.boolean().optional().default(false),
});

export const joiLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const joiPackageSchema = Joi.object({
  Destination: Joi.string().required(),
  Duration: Joi.number().required(),
  Category: Joi.string().required(),
  Price: Joi.number().required(),
  Available_Date: Joi.date().required(),

  images: Joi.array().items(Joi.string()),
  Description: Joi.string(),
});
export const joiReviewSchema = Joi.object({
  user: Joi.string().required(),
  package: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  reviewText: Joi.string().min(10).required(),
});
