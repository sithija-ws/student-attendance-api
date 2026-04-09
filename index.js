import e from "express";
import mongoose from "mongoose";
import 'dotenv/config';

//routers
import studentRouter from "./routes/studentRouter.js";
import lecturerRouter from "./routes/lecturerRouter.js";

import cors from "cors";



const app = e();
app.use(e.json());
app.use(cors());
//database
const mongoUrl = process.env.mongoUrl;
mongoose.connect(mongoUrl).then(() => {
    console.log("Database connected sucessfully 🍫🕯️");
}).catch((err) => {
    console.log(err);
});

//routes
app.use("/api/student", studentRouter);
app.use("/api/lecturer", lecturerRouter);
app.use("/api/login", )



const port = process.env.port ;


app.listen(port, ()=>{
    console.log("App is running on port 3000 ❤️")
})