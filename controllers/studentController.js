import Student from "../models/student.js";

//Student Manual Register
export const studentRegister = async (req, res) => {
    try{

        let isexist = await Student.findOne({email: req.body.email});
        if(isexist){
            return res.status(400).json({
                message: "student already exist with this email 😒"
            })
        }


        let data = req.body;

        let student = new Student(data);

        await student.save();
        return res.status(200).json({
            message: "student registered successfully ✅",
            student
        })
    }catch{
        res.status(500).json({
            message: "internal server error!"
        })

    }
    
}