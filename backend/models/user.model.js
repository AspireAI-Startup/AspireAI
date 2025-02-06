import mongoose from "mongoose";

const userSchema = new mongoose.model (
    {
        fullName:{
            firstName:{
                type:String,
                required:true
            },
            lastName:{
                type:String,
                required:true
            }
        },

        email:{
            type:String,
            required:true,
            unique:true
        },

        password:{
            type:String,
            required:true
        },

        mobileNo:{
            type:Number,
            required:true,
            unique:true
        },

        academicLevel:{
            type:String,
            enum:["class 10", "class 12"],
            required:true
        },
        

},{timestamps:true}
);


export const User = mongoose.model("User",userSchema);