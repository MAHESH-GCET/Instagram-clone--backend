// import express
const express=require('express');

// create router application
const userApi=express.Router();

// body parser
userApi.use(express.json());


// import token verification middleware
const verifyToken=require('../middlewares/verifyToken');

// import Controllor functions
const {userRegistration,
    userLogin,
    updateDetails,
    deleteUser,
    forgotPassword,
    resetPassword,
    detailedViewuser,
    FileUpload,
    userDetails
}=require('../controllors/user.controllor')

// user registartion
userApi.post('/userApi/register',userRegistration);

// user login
userApi.post('/userAPi/login',userLogin);

// user details
userApi.get('/user/:username',verifyToken,userDetails)

// edit / update details
userApi.put('/userApi/:username/update',verifyToken,updateDetails);

// delete user
userApi.delete('/:username/delete',verifyToken,deleteUser);

// forgot password
userApi.post('/forgot-password',forgotPassword);

// reset password
userApi.put('/reset-password/:email',resetPassword);

// detailed view
userApi.get('/home/:username',verifyToken,detailedViewuser)

// check file upload
userApi.post('/upload',FileUpload);

// export user API
module.exports=userApi;
