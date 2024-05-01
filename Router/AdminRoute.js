import express from 'express'
const router = express()
import { adminLogin,allUser, getUserById,createPackacge,viewallpackage,updatepackage,deletepackage} from '../Contoller/Admincontroler.js'
import verifytoken1 from '../Middleware/Adminauth.js'
import imageUpload from '../ImageUpload/Imageupload.js'

router
.post("/admin_login",adminLogin)
.use(verifytoken1)
.get("/users",allUser)
.get("/users/:id",getUserById)
.post("/packages", imageUpload,createPackacge)
.get("/packages",viewallpackage)
.put("/packages/:id",updatepackage)
.delete("/packages/:id",deletepackage)

 




export default router