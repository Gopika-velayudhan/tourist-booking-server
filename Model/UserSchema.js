import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        
        
    },
    Phonenumber:{
        type:Number,
        required:true,
        
    },
    Password:{
        type:String,
        required:true
    },
    cart:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Package"
        }
    ],
    wishlist:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Package"
        }
    ]
},{ timestamps: true })
export default mongoose.model("user",userSchema)