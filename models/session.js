import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
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
        enum : ["physical", "online"]
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
        type: String,
        required: true
    }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;