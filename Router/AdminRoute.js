import express from 'express'
const router = express()
import { adminLogin,allUser, getUserById,createPackage,} from '../Contoller/Admincontroler.js'
import imageUpload from '../ImageUpload/Imageupload.js'

router
.post("/adminlogin",adminLogin)
.get("/alluser",allUser)
.get("/getuserbyid/:id",getUserById)
.post("/createPackage", imageUpload,createPackage)




export default router