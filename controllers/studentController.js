import Student from "../models/student.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import 'dotenv/config';
import { checkIsLecturer } from "./verifyMiddleware.js";

//Student Manual Register
export const studentRegister = async (req, res) => {
    try{
        //check is lecturer
        await checkIsLecturer(req, res);


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
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: "internal server error!"
        })

    }
    
}

export const studentRegisterFromCSV = async (req,res)=>{
    try {
        //check is lecturer
        await checkIsLecturer(req, res);

        const {email, studentID, name, institution } = req.body;

        //Basic validation
        if (!name || !studentID || !email || !institution) {
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
            name, studentID, email, institution
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

export const generateOtp = async (req,res)=>{
    try {
        //check is student registered
        const {email} = req.body;
        const student = await Student.findOne({email});
        if(!student){
            return res.status(404).json({
                message: "Student not Found!"
            })
        }

        //generate 6 digit OTP
         const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 5 minutes
        student.otp = otp;
        student.otpExpire = Date.now() + 5 * 60 * 1000;

        await student.save();

        // Send email
        const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        family: 4,
        auth: {
            user: "sithija.ws@gmail.com",
            pass: process.env.pswd,
        },
        });

        await transporter.verify();
        console.log("SMTP ready");

        await transporter.sendMail({
        from: "sithija.ws@gmail.com",
        to: email,
        subject: "OTP for Password Reset",
        text: `Your OTP is: ${otp}`,
        });

        res.status(200).json({ message: "OTP sent to email" });

    } catch (error) {
        console.error("OTP ERROR:", error); // 🔥 
        res.status(500).json({
            "message": "internal server error 💥"
        })
    }
}

export const changePassword = async (req,res)=>{
    try {
        const {email, newPassword, confirmPassword ,otp} = req.body;

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                message: "password don't match"
            })
        }

        //check student exists
        let student = await Student.findOne({email});
        if(!student){
            return res.status(404).json({
                message: "Student not Found!"
            })
        }

        // Check OTP
        if (String(student.otp) !== String(otp) || student.otpExpire < Date.now()) {
            return res.status(400).json({ 
                message: "Invalid or expired OTP" 
            });
        }

        //hash pswd
        const hashedPswd = await bcrypt.hash(newPassword, 10);
        student.password = hashedPswd;

        //clear otp
        student.otp = null;
        student.otpExpire = null;

        await student.save()

        res.status(200).json({ message: "Password updated successfully" });


    } catch (error) {
        console.error("ERROR:", error); // 🔥 
        res.status(500).json({
            "message": "internal server error 💥"
        })
    }
}


export const getStudentsByInstitution = async (req,res)=>{
    try {
        //check is lecturer
        await checkIsLecturer(req, res);

        const { institution } = req.query;

        if (!institution) {
            return res.status(400).json({ message: "Institution is required" });
        }

        // Fetching students matching the institution
        const students = await Student.find({ institution });

        return res.status(200).json(students);
    } catch (error) {
        console.error("Fetch Students Error:", error.message);
        res.status(500).json({ message: "internal server error! 💥" });
    }
}


export const manageStudentAction = async (req, res) => {
    try {

        //check is lecturer
        await checkIsLecturer(req, res);


        const { studentID, action, institution } = req.body;

        if (action === "remove") {
            // Find and delete the student
            const deletedStudent = await Student.findOneAndDelete({ 
                studentID, 
                institution 
            });

            if (!deletedStudent) {
                return res.status(404).json({ message: "Student not found in this institution" });
            }

            console.log(`Student ${studentID} removed successfully ✅`);
            return res.status(200).json({ message: "Student removed successfully ✅" });
        }

        return res.status(400).json({ message: "Invalid action" });
    } catch (error) {
        console.error("Manage Student Error:", error.message);
        res.status(500).json({ message: "internal server error! 💥" });
    }
};