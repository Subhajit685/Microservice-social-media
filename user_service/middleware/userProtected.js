import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userProtected = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);

        if (!token || token.split(".").length !== 3) {
            return res.status(401).json({ success: false, message: "Malformed or missing token" });
        }

        // console.log("Token received:", token); // Temporary for debugging

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decode.id || decode._id); // decode.id may already be an ObjectId

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("userProtected error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default userProtected;
