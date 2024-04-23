import Joi from "joi";

export const joiUserSchema = Joi.object({
  Username: Joi.string(),
  email: Joi.string().email(),
  Phonenumber: Joi.number().min(10),
  password: Joi.string(),
  otp: Joi.string(),
});

export const joiPackageSchema = Joi.object({
  Destination: Joi.string(),
  Duration: Joi.number(),
  Category: Joi.string(),
  Price: Joi.number(),
  Available_Date: Joi.date(), 
  Image: Joi.string(), 
  Description: Joi.string()
});