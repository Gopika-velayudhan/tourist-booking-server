import Joi from "joi";

export const joiUserSchema = Joi.object({
  Username: Joi.string(),
  email: Joi.string().email(),
  Phonenumber: Joi.number().min(10),
  password: Joi.string(),
  otp: Joi.string(),
});



export const joiPackageSchema = Joi.object({
  Destination: Joi.string().required(),
  Duration: Joi.number().required(),
  Category: Joi.string().required(),
  Price: Joi.number().required(),
  Available_Date: Joi.date().required(),
    
  images: Joi.array().items(Joi.string())
});

