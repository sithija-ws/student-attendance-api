import e from "express";
import mongoose from "mongoose";
import 'dotenv/config';

//routers
import studentRouter from "./routes/studentRouter.js";
import lecturerRouter from "./routes/lecturerRouter.js";
import userLoginRouter from "./routes/userLoginRouter.js";
import cors from "cors";
import sessionRouter from "./routes/sessionRouter.js";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");



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
app.use("/api/login", userLoginRouter);
app.use("/api/sessions", sessionRouter);
app.get("/", (req, res) => {
  res.send("Backend is running");
});



const PORT = process.env.PORT || 3000 ;


app.listen(PORT, ()=>{
    console.log(`App is running on Port ${PORT} ❤️`)
})