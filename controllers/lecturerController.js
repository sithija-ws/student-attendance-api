import { data } from "react-router-dom";
import Lecturer from "../models/lecturer";
import bcrypt from "bcrypt";

export const lecturerRegister = async (req,res)=>{
    try {
        const {email, password , confirmPassword, name } = req.body;

        //check if lecturer exists
        let isExists = await Lecturer.findOne({email});
        if(isExists){
            return res.status(400).json({
                message: "user already registered!"
            })
        }

        //check password confirmation
        if(password !== confirmPassword) {
            return res.status(400).json({
                message: "passwords do not match!"
            })
        } 

        const hashedPassword = await bcrypt.hash(password,10);

        let lecturer = new Lecturer({
            name,
            email,
            password: hashedPassword
        });

        await lecturer.save();
        return res.status(201).json({
            message: "lecturer registered successfully ✅"
        })


    } catch (error) {
        console.error("ERROR:", error); // 🔥 
        res.status(500).json({
            "message": "internal server error 💥"
        })
    }
}