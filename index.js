import e from "express";
import mongoose from "mongoose";
require('dotenv').config();

const app = e();

//database

const port = process.env.port || 3000;


app.listen(3000, ()=>{
    console.log("App is running on port 3000 ❤️")
})