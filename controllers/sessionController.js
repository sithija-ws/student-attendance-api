import Session from "../models/session.js";

export const createSession = async (req, res) => {
    try {
        const user = req.user;
        if(user.role !== "lecturer"){
            return res.status(403).json({message: "You're not allowed to do this operation!"});
        }

        const { 
            date, 
            institute, 
            subject, 
            lessonName, 
            sessionMode, 
            startTime, 
            endTime, 
            location 
        } = req.body;

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expirationDate = new Date(Date.now() + 5 * 60 * 1000);

        const newSession = new Session({
            date,
            institute,
            subject,
            lessonName,
            sessionMode,
            startTime, 
            endTime, 
            location,
            lecturer: user.id, // ID from the decoded JWT
            otp: generatedOtp,
            otpExpire: expirationDate
        });

        await newSession.save();
        res.status(201).json(generatedOtp);
    } catch (error) {
        res.status(500).json({message: "something went wrong"});
    }
}