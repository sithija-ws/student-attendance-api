import e from "express";
import mongoose from "mongoose";
import 'dotenv/config';

const app = e();

//database
const mongoUrl = process.env.mongoUrl;
mongoose.connect(mongoUrl).then(() => {
    console.log("Database connected sucessfully 🍫🕯️");
}).catch((err) => {
    console.log(err);
});

const port = process.env.port || 3000;


app.listen(port, ()=>{
    console.log("App is running on port 3000 ❤️")
})