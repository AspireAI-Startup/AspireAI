import mongoose from "mongoose";

const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB Connected");
    }

    catch(error){
        console.log("error while connecting mongodb",error);
        
    }

}

export default connectDb