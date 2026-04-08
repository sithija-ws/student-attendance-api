import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        required: false
    },
    otpExpire: {
        type: Date,
        required: false
    }
})

const Student = mongoose.model("Student", studentSchema);
export default Student