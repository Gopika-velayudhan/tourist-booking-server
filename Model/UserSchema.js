import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    Username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        
        
    },
    Phonenumber:{
        type:Number,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    },
    ProfileImage:{
        type:String
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