// import express module
const express=require('express');

// create express application
const app=express();

//cors
const cors=require("cors");
app.use(cors());

// configure env variables
require('dotenv').config();

// server
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
})

// fixing "413 Request Entity Too Large" errors
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

// importing router from index.js fille
const router=require('./routes/index')

// middleware for router
app.use('/',router);

module.exports=app;






































































//error handling middlewares
app.use((err, req, res, next)=>{
    res.send({errMsg: err.message})
})

//handlling errors in application
app.use((error, req,res,next)=>{
    res.send({message:"error occured",Error:error.message})
})