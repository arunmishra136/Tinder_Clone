import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        console.log("Checking cookies:", req.cookies);  // <-- Verify cookie presence

        const token = req.cookies.jwt;

        if (!token) {
            console.log("No token provided");
            return res.status(401).json({
                success: false,
                message: "Not authorized - No token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);  // <-- Verify token decoding

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            console.log("User not found in database");
            return res.status(401).json({
                success: false,
                message: "Not authorized - User not found",
            });
        }

        req.user = currentUser;
        console.log("User authenticated:", req.user);  // <-- Verify user setting
        next();
    } catch (error) {
        console.log("Error in auth middleware: ", error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Not authorized - Invalid token",
            });
        } else {
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
};
