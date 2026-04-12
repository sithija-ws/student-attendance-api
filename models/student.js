import mongoose from "mongoose";
import validator from "validator"

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
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
        validator: validator.isEmail,
        message: props => `${props.value} is not a valid email!`
    }
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
    },
    institution: {
        type: String,
        required: true
    }
})

const Student = mongoose.model("Student", studentSchema);
export default Student


/*
robert@yahoo.com
Donald@yahoo.com
sirisena@yahoo.com
sithijax2@gmail.com
123





*/