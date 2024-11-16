import User from '../models/User.js';
import jwt from 'jsonwebtoken';


const signToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

}

export const signup = async (req, res) => {
    const { name, email, password, age, gender, genderPreference } = req.body;

    try {
        // Check if all required fields are provided
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if the user is at least 18 years old
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "You must be at least 18 years old",
            });
        }

        // Check if the password is at least 6 characters long
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            });
        }

        // Create a new user if no duplicate email exists
        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference,
        });

        const token = signToken(newUser._id);
res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // in milliseconds
    httpOnly: true, // prevents XSS attacks
    sameSite: "lax", // allows limited cross-origin requests
    secure: process.env.NODE_ENV === "production" // `false` in development
});


        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login= async(req,res) =>{
    const {email,password} =req.body
    try{
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const user = await User.findOne({email}).select("+password");

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password",
            });
        }

        const token=signToken(user._id);

        res.cookie("jwt",token,{
            maxAge: 7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
        });

        res.status(200).json({
            success:true,
            user,
        });

    }
    catch(error){
        console.log("Error in login controller:",error);
        res.status(500).json({success : false,message:"Server error"});
    }
}
export const logout= async(req,res) =>{
    res.clearCookie("jwt");
    res.status(200).json({success: true, message: "Logged out successfully"});
}