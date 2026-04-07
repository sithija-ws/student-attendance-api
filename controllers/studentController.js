import Student from "../models/student.js";
import bcrypt from "bcrypt"

//Student Manual Register
export const studentRegister = async (req, res) => {
    try{

        let isexist = await Student.findOne({email: req.body.email});
        if(isexist){
            return res.status(400).json({
                message: "student already exist with this email 😒"
            })
        }


        let data = req.body;

        //hash password if sent 
        if(data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }

        let student = new Student(data);

        await student.save();

        console.log("student registered successfully ✅");
        return res.status(200).json({
            message: "student registered successfully ✅",
            student
        })
    }catch{
        console.log(err.message);
        res.status(500).json({
            message: "internal server error!"
        })

    }
    
}