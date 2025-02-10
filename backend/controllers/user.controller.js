import { User } from "../models/user.model";

export const registerUser = async (req ,res) => {
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


        res.status(201).json({ message: "User registered successfully", user: newUser });
    } 
    
    catch (error) {
      res.status(500).json({ message: "Error", error: error.message });
    }
  };

        

    