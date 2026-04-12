import mongoose from "mongoose";
import validator from "validator"

const lecturerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
        validator: validator.isEmail,
        message: props => `${props.value} is not a valid email!`
    }},
    password: {
        type: String,
        required: true
    }

    
})

const Lecturer = mongoose.model("Lecturer", lecturerSchema);
export default Lecturer;

/**
 * lalitha@gmail.com
 * nawodi@gmail.com
 * 
 */