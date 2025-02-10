import { User } from "../models/user.model";
import bcrypt from "bcrypt";

const genrateAccessTokenRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

const registerUser = async (req ,res) => {
    try {
        const { firstName , lastName , email , password , mobileNo} = req.body;


        const exists = await User.findOne({email})
        if (exists){
            return res.status(400).json({message:"user already exists"});
        }

        const hashPassword = await User.hashPassword(password);

        const newUser = await User.create({
            fullName: { firstName ,lastName},
            email,
            password: hashPassword,
            mobileNo,
        });

        const { accessToken, refreshToken } = await genrateAccessTokenRefreshToken(newUser._id);
        
        const options = {
            httpOnly: true,
            secure: true, 
        }
        res.cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options);

        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } 
    
    catch (error) {
      return res.status(500).json({ message: "Error", error: error.message });
    }
  };

  //LOGIN

const loginUser = async (req ,res ) => {
    try {
        const {email , password} = req.body;

        const exists = await User.findOne({email});
        if (!exists){
            return res.status(404).json({message:"user not found"});
        }

        const match = await bcrypt.compare(password,User.password);
        if (!match){
            return res.status(404).json({message:"invalid password"});
        }
        
    } catch (error) {
        return res.status(404).json({message:"Error found"});
    }
}

export {registerUser,loginUser};


        

    