import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true  
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lecturer', 
        required: true
    },
    institute: {
        type: String,
        required: true      
    },
    subject: {
        type: String,
        required: true
    },
    lessonName: {
        type: String,
        required: true
    },
    sessionMode : {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    otp: { type: String },
    otpExpire: { type: Date }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;