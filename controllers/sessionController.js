import { compare } from "bcrypt";
import Session from "../models/session.js";



// Helper to calculate distance in meters
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

export const createSession = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user); // <--- Add this
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
            location,
            expiryMinutes
        } = req.body;

        //otp setup
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const minutesToAdd = expiryMinutes ? Number(expiryMinutes) : 5;
        const expirationDate = new Date(Date.now() + minutesToAdd * 60 * 1000);

        const newSession = new Session({
            date,
            institute,
            subject,
            lessonName,
            sessionMode : sessionMode.toLowerCase(),
            startTime, 
            endTime, 
            location: {lat: location.lat,
                lng: location.lng
            },
            lecturer: req.user.id || req.user._id, // ID from the decoded JWT
            otp: generatedOtp,
            otpExpire: expirationDate
        });

        await newSession.save();
        res.status(201).json(newSession);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Backend Error", 
            error: error.message});
    }
}

export const markAttendance = async (req,res) =>{
    try {
        const {otp, location} = req.body;
        const studentID = req.user.id || req.user._id;
        
        const session = await Session.findOne({otp:otp});

        if(!session){
            return res.status(404).json({message: "Invalid OTP! ❌"});
        }

        if(new Date() > session.otpExpire){
            return res.status(400).json({message: "OTP Expired! ❌"});
        }


        //Conditional Location Check
        if (session.sessionMode === "physical") {
            if (!location || !location.lat || !location.lng) {
                return res.status(400).json({ message: "Location access required for Physical sessions! 📍" });
            }

            const distance = getDistance(
                session.location.lat, 
                session.location.lng, 
                location.lat, 
                location.lng
            );

            const MAX_DISTANCE = 50; // Allowed radius in meters (adjust as needed)

            if (distance > MAX_DISTANCE) {
                return res.status(403).json({ 
                    message: `You are too far from the lecture hall (${Math.round(distance)}m away) 🚶‍♂️` 
                });
            }
        }





        //compare session.location with student's req.body.location;
        const updatedSession = await Session.findOneAndUpdate(
            { _id: session._id, "attendees.student": { $ne: studentId } },
            { 
                $push: { 
                    attendees: { student: studentId, timestamp: new Date() } 
                } 
            },
            { new: true }
        );

        if (!updatedSession) {
            return res.status(400).json({ message: "Attendance already marked! ✅" });
        }


        res.status(200).json({ message: "Attendance marked successfully! 🎉" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Server error during attendance", 
            error: error.message});
    }
}