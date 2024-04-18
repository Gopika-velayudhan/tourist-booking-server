import express from 'express'
const router = express()
import { adminLogin,allUser, getUserById,createPackage,} from '../Contoller/Admincontroler.js'
import verifytoken1 from '../Middleware/Adminauth.js'

router
.post("/adminlogin",adminLogin)
.use(verifytoken1)
.get("/alluser",allUser)
.get("/getuserbyid/:id",getUserById)
.post("/createPackage", createPackage)




export default router