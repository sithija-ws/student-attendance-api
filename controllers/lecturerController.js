import Lecturer from "../models/lecturer.js";
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


        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sithija.ws@gmail.com",
                pass: process.env.pswd,
            },
            });

        await transporter.sendMail({
            from: "sithija.ws@gmail.com",
            to: email,
            subject: "OTP for Password Reset",
            text: `Your OTP is ${otp}`
        });

        res.status(200).json({ message: "OTP sent to email" });

    } catch (error) {
        console.log("OTP ERROR:", error.message);
        res.status(500).json({
            message: "internal server error "
        });
    }
}


export const changePassword = async (req,res)=>{
    const {email, newPassword, confirmPassword} = req.body;

    //check password confirmation
    if(newPassword !== confirmPassword){
        return res.status(400).json({
            message: "passwords do not match!"
        })
    }
}