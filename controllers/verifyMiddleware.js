import jwt from "jsonwebtoken";

export const verifyToken = async (req,res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader); // <--- debug

    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token:", token); // <--- debug

    if(!token){
        return res.status(401).json({ message: "Unauthorized Access 🚫" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified:", verified); // <--- debug
        req.user = verified;
        next();
    } catch (error) {
        console.log("JWT Error:", error.message); // <--- debug
        res.status(401).json({message: "Invalid or Expired Token 🔑"});
    }
}