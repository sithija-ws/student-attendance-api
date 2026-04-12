import Session from "../models/session.js";
import { getDistance } from 'geolib';



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
            sessionMode,
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

// 1. Check session details (First fetch in your frontend)
export const checkSession = async (req, res) => {
    try {
        const { otp } = req.params;

        // Find by OTP only
        const session = await Session.findOne({ otp });

        if (!session) {
            return res.status(404).json({ message: "Invalid OTP code." });
        }

        // Return sessionMode
        res.status(200).json({ sessionMode: session.sessionMode }); 
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// 2. Mark Attendance (Second fetch in your frontend)
export const markAttendance = async (req, res) => {
    // 1. Pull studentId from req.body (or req.user.id if using JWT)
    const { otp, location, studentId } = req.body;

    try {
        const session = await Session.findOne({ otp });

        if (!session) {
            return res.status(404).json({ message: "Session not found." });
        }

        // Check Expiry
        if (new Date() > session.otpExpire) {
            return res.status(400).json({ message: "This lecture session has expired." });
        }

        // Geolocation Check
        if (session.sessionMode === 'Physical') {
            if (!location || !location.lat || !location.lng) {
                return res.status(400).json({ message: "Location is required for this session." });
            }

            const distance = getDistance(
                { latitude: session.location.lat, longitude: session.location.lng },
                { latitude: location.lat, longitude: location.lng }
            );

            console.log(`Distance calculated: ${distance} meters`);

            if (distance > 30) { 
                return res.status(403).json({ message: `Too far! You are ${distance}m away.` });
            }
        }

        // Duplicate Check
        const alreadyMarked = session.attendedStudents.some(
            (id) => id?.toString() === studentId?.toString()
        );

        if (alreadyMarked) {
            return res.status(400).json({ message: "You have already marked your attendance." });
        }

        // Push the  ID
        session.attendedStudents.push(studentId);
        await session.save();

        res.status(200).json({ message: "Attendance marked successfully! ✅" });

    } catch (error) {
        console.error("Attendance Error:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const sessionList = async (req,res)=>{
    try {
        const user = req.user;
        
        //isLogin check
        if(!user){
            return res.status(401).json({message: "Please Login and continue!"});
        }

        //isLecturer check
        if(user.role !== "lecturer"){
            return res.status(403).json({message: "You're not allowed to do this operation!"});
        }

        const sessions = await Session.find({lecturer: user.id});
        res.status(200).json(sessions);



    } catch (error) {
        res.status(500).json({
            message: "Backend Error", 
            error: error.message    
        })
    }
}

export const deleteSession = async (req,res) =>{
    try {
        const user = req.user;
        
        //isLogin check
        if(!user){
            return res.status(401).json({message: "Please Login and continue!"});
        }

        //isLecturer check
        if(user.role !== "lecturer"){
            return res.status(403).json({message: "You're not allowed to do this operation!"});
        }

        const session = await Session.findOne({_id: req.params.id});
        if(!session){
            return res.status(404).json({message: "Session not found!"});
        }

        console.log(session.lessonName)

        await Session.deleteOne({ _id: req.params.id });
        res.status(200).json({message: "Session deleted successfully!"});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Backend Error", 
            error: error.message    
        })
    }
}

export const getAttendanceReport = async (req,res) =>{
    try {
        const user = req.user;
        const { id } = req.params;
        
        //isLogin check
        if(!user){
            return res.status(401).json({message: "Please Login and continue!"});
        }

        //isLecturer check
        if(user.role !== "lecturer"){
            return res.status(403).json({message: "You're not allowed to do this operation!"});
        }

        // Find session and populate student details
        const session = await Session.findOne({ _id: id, lecturer: user.id })
            .populate('attendedStudents', 'name studentID email'); // Only get necessary fields

        if (!session) {
            return res.status(404).json({ message: "Session not found or unauthorized" });
        }

        // Send the data back
        res.status(200).json({
            sessionInfo: {
                subject: session.subject,
                date: session.date
            },
            students: session.attendedStudents
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }
}