import express from 'express'
const router = express()
import { adminLogin,allUser, getUserById,createPackage,} from '../Contoller/Admincontroler.js'
import verifytoken1 from '../Middleware/Adminauth.js'

router
.post("/admin_login",adminLogin)
.use(verifytoken1)
.get("/alluser",allUser)
.get("/users/:id",getUserById)
.post("/Package", createPackage)




export default router