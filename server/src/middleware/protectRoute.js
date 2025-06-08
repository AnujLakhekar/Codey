import jwt from "jsonwebtoken";
import User from "../Schema/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; 

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (optional)
    const user = await User.findById(decoded.userId).select("-personal_info.password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE ERROR]", error.message);
    return res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};

export default authMiddleware;
