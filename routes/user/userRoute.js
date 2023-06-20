// import express
const express=require('express');

// create router application
const userApi=express.Router();

// body parser
userApi.use(express.json());


// import token verification middleware
const verifyToken=require('../../middlewares/verifyToken');

// import handler
const {
    registerHandler,
    loginHandler,
    userHandler,
    userDetailsHandler,
    deleteUserHandler,
    userDetailedViewHandler,
    forgotPasswordHandler,
    resetPasswordHandler
}= require('./userHandler')

// import validation
const {
    validateRegister
}= require('../../middlewares/validateUser')

// user registartion
userApi.post('/userApi/register',validateRegister,registerHandler);

// user login
userApi.post('/userAPi/login',loginHandler);

// user details
userApi.get('/user/:username',verifyToken,userHandler)

// edit / update details
userApi.put('/userApi/:username/update',verifyToken,userDetailsHandler);

// delete user
userApi.delete('/:username/delete',verifyToken,deleteUserHandler);

// detailed view
userApi.get('/home/:username',verifyToken,userDetailedViewHandler);


// forgot password
userApi.post('/forgot-password',forgotPasswordHandler);

// reset password
userApi.put('/reset-password/:email',resetPasswordHandler);





// export user API
module.exports=userApi;
















// // check file upload
// userApi.post('/upload',FileUpload);