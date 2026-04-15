import Lecturer from "../models/lecturer.js";
import bcrypt from "bcrypt";
import Student from "../models/student.js";
import dns from "node:dns";
import { sendOtpEmail } from "../utils/sendEmail.js";

dns.setDefaultResultOrder("ipv4first");

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

        //check is a student email
        let isStudent = await Student.findOne({email});
        if(isStudent){
            return res.status(400).json({
                message: "Students not allowed to sign up as lecturers 🚫"
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

export const generateOTPL = async (req,res)=>{
    try {
        const {email} = req.body;
        const lecturer = await Lecturer.findOne({email});
        if(!lecturer){
            return res.status(404).json({
                message: "lecturer not found!"
            })
        }

        //generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        lecturer.otp = otp;
        lecturer.otpExpire = Date.now() + 5 * 60 * 1000;
        await lecturer.save();


        await sendOtpEmail("sithija.ws@gmail.com", otp);

        res.status(200).json({ message: "OTP sent to email" });

    } catch (error) {
        console.log("OTP ERROR:", error.message);
        res.status(500).json({
            message: "internal server error "
        });
    }
}


export const changePassword = async (req,res)=>{
    try {
        const {email, newPassword, confirmPassword, otp} = req.body;

        const lecturer = await Lecturer.findOne({email: email});
        if(!lecturer){
            return res.status(403).json({
                message: "User not registered ⛔👤"
            });
        }

        //check password confirmation
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                message: "passwords do not match!"
            })
        }

        //check otp
        if(String(lecturer.otp) !== String(otp) || lecturer.otpExpire < Date.now()){

            return res.status(400).json({
                message: "Invalid or expired OTP"
            })
        }

        //hash pswd
        const hashedPswd = await bcrypt.hash(newPassword, 10);
        lecturer.password = hashedPswd;

        //clear otp
        lecturer.otp = null;
        lecturer.otpExpire = null;

        await lecturer.save();
        return res.status(200).json({
            message: "Password changed successfully ✅"
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal server error 🤖"
        });
    }
    
}