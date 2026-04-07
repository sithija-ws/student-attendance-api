import e from "express";
import mongoose from "mongoose";
import 'dotenv/config';

const app = e();

//database

const port = process.env.port || 3000;


app.listen(port, ()=>{
    console.log("App is running on port 3000 ❤️")
})