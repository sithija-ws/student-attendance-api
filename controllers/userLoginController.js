import Student from "../models/student";
import Lecturer from "../models/lecturer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const loginUser = async (req,res)=>{
    try {
        const {email, password} = req.body;

        const user = await Student.findOne({email});
        let role = "student";

        if(!user){
            user = await Lecturer.findOne({email});
            role = "lecturer";
        }

        if(!user){
            return res.status(404).json({message: "User not found 👤⛔"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id, role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(200).json({user, token});
    
    
    
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}