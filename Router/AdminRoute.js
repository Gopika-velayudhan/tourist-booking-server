import express from 'express'
const router = express()
import { adminLogin,allUser, getUserById,createPackage,} from '../Contoller/Admincontroler.js'
import verifytoken1 from '../Middleware/Adminauth.js'
import imageUpload from '../ImageUpload/Imageupload.js'

router
.post("/admin_login",adminLogin)
.use(verifytoken1)
.get("/users",allUser)
.get("/users/:id",getUserById)
.post("/packages", imageUpload,createPackage)




export default router