import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    try {
        const { image, ...otherData } = req.body;
        let updatedData = { ...otherData };

        if (image && image.startsWith("data:image")) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                
                if (uploadResponse && uploadResponse.secure_url) {
                    updatedData.image = uploadResponse.secure_url;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Image upload failed. Profile update aborted.",
                    });
                }
            } catch (error) {
                console.log("Error uploading image: ", error);
                return res.status(400).json({
                    success: false,
                    message: "Error uploading image. Profile update aborted.",
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });
        
        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error in update profile: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
