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
   
    
    
   Review: {
        type:String
   },
    wishlist:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Package"
        }
    ],
    isActive:{
        type:Boolean,
        default:true
        
    },
    isBlocked :{
        type:Boolean,
        default:false
    }
},{ timestamps: true })
export default mongoose.model("user",userSchema)