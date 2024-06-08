import express from "express";
const router = express();
import {
  adminLogin,
  allUser,
  getUserById,
  createPackacge,
  viewallpackage,
  blockuser,
  deletepackage,
  SinglePackage,
  updatepackages,
  getAllBookings,
} from "../Contoller/Admincontroler.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../Contoller/CategoryController.js";
import verifytoken1 from "../Middleware/Adminauth.js";

import imageUpload from "../ImageUpload/Imageupload.js";

router
  .post("/admin_login", adminLogin)
  .use(verifytoken1)
  .get("/users", allUser)
  .get("/users/:id", getUserById)
  .post("/packages", imageUpload, createPackacge)
  .get("/packages", viewallpackage)
  .get("/packages/:id", SinglePackage)
  .put("/packages/:id", updatepackages)
  .delete("/packages/:id", deletepackage)
  .patch("/users/:id", blockuser)
  .get("/bookings", getAllBookings)
  .post("/categories", createCategory)
  .get("/categories", getCategories)

  .put("/categories/:id", updateCategory)
  .delete("/categories/:id", deleteCategory);

export default router;
