import Joi from "joi";

export const joiUserSchema = Joi.object({
  Username: Joi.string(),
  Email: Joi.string().email(),
  Phonenumber: Joi.number().min(10),
  Password: Joi.string(),
  otp: Joi.string(),
});
export const joiPackageSchema = Joi.object({
  Destination: Joi.string(),
  Duration: Joi.number(),
  Price: Joi.number(),
  Available_Date: Joi.array().items(
    Joi.object({
      date: Joi.date().required(),
      slots: Joi.array().items(Joi.number()).required(),
    })
  ),
  Image: Joi.string(),
  Description: Joi.string(),
});
