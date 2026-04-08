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

export const studentRegisterFromCSV = async (req,res)=>{
    try {
        const {email, studentID, name } = req.body;

        //Basic validation
        if (!name || !studentID || !email) {
        return res.status(400).json({ message: "All fields required" });
        }

        // Check duplicate
        const existingStudent = await Student.findOne({
        $or: [{ studentID }, { email }],
        });

        if (existingStudent) {
        return res.status(409).json({ message: "Student already exists" });
        }

        const newStudent = new Student({
            name, studentID, email
        })

        await newStudent.save();

        return res.status(201).json({
            message: "Student registered successfully",
            student: newStudent,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
    
}