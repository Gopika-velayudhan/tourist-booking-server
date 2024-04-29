import Package from "../Model/PackageSchema.js";
import User from "../Model/UserSchema.js";
import Jwt from "jsonwebtoken";

import { trycatchmidddleware } from "../Middleware/trycatch.js";
import { joiPackageSchema } from "../Model/validateSchema.js";


export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = Jwt.sign(
        { email: email },
        process.env.ADMIN_ACCESS_TOKEN_SECRT
      );
      return res.status(200).send({
        status: "Success",
        message: "Admin Login Successful",
        data: token,
      });
    } else {
      return res.status(404).send({
        status: "Failed",
        message: "Admin not found",
        success: false,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const allUser = async (req, res,next) => {
  try{
  const allUser = await User.find();
  if (allUser.length === 0) {
    return next(trycatchmidddleware(404, "user not found"));
  } else {
    res.status(200).json({
      status: "Success",
      message: "successfully fetched all user",

      data: allUser,
    });
  }
}catch(err){
  next(err)
}
};
export const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  try{
  const user = await User.findById(userId);
  if (!user) {
    return next(trycatchmidddleware(404, "user not found"));
  }
  res.status(200).json({
    status: "success",
    message: "successfully fetched user",
    data: user,
  });
}catch(err){
  next(err)
}
};
export const createPackacge = async (req,res,next) =>{
  console.log(req);
  const {value,error} = joiPackageSchema.validate(req.body)
  if(error){
    next (trycatchmidddleware(400,error.message))
  }
  try{
    const newpack = await Package.create({
      ...value
    })
    res.status(201).json({
      status:"success",
      message:"data created successfully",
      data : newpack
    })
  }catch(err){
    next(err)
  }
} 
export const viewallpackage = async(req,res,next)=>{
  try{
    const packages = await Package.find()
    if(packages){
      res.status(200).json({
        status:"Success",
        message:"successfully package fetched",
        data :packages
      })
    }else{
      next(trycatchmidddleware(404,"package not found"))
    }
  }catch(err){
    next(err)
  }
}
export const updatepackage = async (req,res,next)=>{
  try{
    const {value,error} = joiPackageSchema.validate(req.body)
    if(error){
      next(trycatchmidddleware(401,error.message))
    }
    const updatepackage = await Package.findByIdAndUpdate(
      _id,
      {$set:{...value}},
      {new:true}
    );
    if(updatepackage){
      const updatepackages = await Package.findById(_id);
      return res.status(200).json({
        status:"success",
        message:'successfully updated data',
        data:updatepackages
      });
    }else{
      next(trycatchmidddleware(404,"package not found"))
    }
  }catch(err){
    next(err)
  }
}


