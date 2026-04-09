import jwt from "jsonwebtoken";

const verifyToken = async (req,res, next)=>{
    //get token from frontend
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: "Unauthorized Access 🚫"
        });
    }

    try {
        //verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

        
    } catch (error) {
        res.status(401).json({message: "Invalid or Expired Token 🔑"});
    }
}