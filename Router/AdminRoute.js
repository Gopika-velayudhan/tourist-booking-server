import express from 'express'
const router = express()
import { adminLogin } from '../Contoller/Admincontroler.js'

router
.post("/adminlogin",adminLogin)



export default router