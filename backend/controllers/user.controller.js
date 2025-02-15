import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

const genrateAccessTokenRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashPassword = await User.hashPassword(password);

    const newUser = await User.create({
      fullName: { firstName, lastName },
      email,
      password: hashPassword,
      mobileNo,
    });

    if (!newUser) {
      return res.status(400).json({ message: "user not created" });
    }
    delete newUser._doc.password

    const { accessToken, refreshToken } = await genrateAccessTokenRefreshToken(
      newUser._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options);

    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: "Error", error: error.message });
  }
};

//LOGIN

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({ message: "invalid password" });
    }

    const { accessToken, refreshToken } = await genrateAccessTokenRefreshToken(
      user._id
    );
    delete user._doc.password

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options);
    return res.status(201).json({ message: "User login successfully", user, accessToken, refreshToken });
  } catch (error) {
    return res.status(404).json({ message: "Error found" });
  }
};

//Get User Profile

const getUserProfile = async (req, res) => {
  try {
    const userId= req.user._id

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({message: "User not found" });
    }

    return res.status(200).json({message:"user profile", user});
  }catch (error) {
    return res.status(404).json({message: "Server Error", error: error.message });
  }
};


//Forget Password


const forgetPassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    const {oldPassword, newPassword} = req.body;
    

    const user = await User.findById(userId).select("+password");
    if (!user){
      return res.status(404).json({message:"user not found"});
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: "Password changed successfully" }); 

  } catch (error) {
    return res.status(404).json({message:"server error", error:error.message});

  }
}





//LOGOUT

const userLogout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    const { accessToken, refreshToken } = await genrateAccessTokenRefreshToken(
      req.user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .clearCookie("refreshToken", refreshToken, options)
      .clearCookie("accessToken", accessToken, options);

    return res.status(201).json({ message: "Logout Successful" });
  } catch (error) {
    return res.status(404).json({ message: "Error in Logout" });
  }
};

export { registerUser, loginUser, getUserProfile, forgetPassword, userLogout };
