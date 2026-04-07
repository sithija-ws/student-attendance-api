import e from "express";
import mongoose from "mongoose";
import 'dotenv/config';

//routers
import studentRouter from "./routes/studentRouter.js";

const app = e();
app.use(e.json());

//database
const mongoUrl = process.env.mongoUrl;
mongoose.connect(mongoUrl).then(() => {
    console.log("Database connected sucessfully 🍫🕯️");
}).catch((err) => {
    console.log(err);
});

//routes
app.use("/api/student", studentRouter);



const port = process.env.port || 3000;


app.listen(port, ()=>{
    console.log("App is running on port 3000 ❤️")
})