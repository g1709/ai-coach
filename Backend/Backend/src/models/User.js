const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    leetcodeUsername:{
        type:String,
        trim:true,
        default:null
    },
    avatarUrl:{
        type:String,
        default:null
    }
},{timestamps:true})

const userModel=mongoose.model("User",userSchema)

module.exports=userModel
