// import required modules
// library to handle async requests
const expressAsyncHandler=require('express-async-handler');
// library to hash password
const bcryptjs=require('bcryptjs');
// library to handle validations
const joi=require('joi');
// authentication library
const jwt=require('jsonwebtoken');
// import database
const db=require('../models/index');



// user validation schema
const userSchema=joi.object({
    username:joi.string().alphanum().min(3).max(15).required(),
    fullName:joi.string().min(5).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    age:joi.number().min(18).max(30).required(),
    gender:joi.string().required(),
    profileUrl:joi.string()
})

// user Registration
exports.userRegistration=expressAsyncHandler(async(req,res)=>{
    const data=req.body
    // validate data
    const result=userSchema.validate(data);
    if(result.error){
        res.send({message:"error",payload:result.error.details})
    } 
    else{
        // check if username exists
        const checkUser= await db.Users.findAll({
            where:{
                username:req.body.username
            }
        })
        if (checkUser.length!==0){
            res.status(200).send({message:"User already exists"})
        }
        // no user exists
        else{
            // hash password
            const hashedPassword=await bcryptjs.hash(data.password,10);
            await db.Users.create({
                username:data.username,
                fullName:data.fullName,
                email:data.email,
                password:hashedPassword,
                age:data.age,
                gender:data.gender,
                profileURL:data.profileUrl
            })
            res.status(201).send({message:"user registered"})
        }
    }
})

// user Login
exports.userLogin=expressAsyncHandler(async(req,res)=>{
    let {username,password}=req.body;
    //check if employee exists
    let userObj=await db.Users.findOne({
      where:{username:username}
    });
    if(userObj==null){
      res.status(200).send({message:"user not found"});
    }
    //if employee exists
    else{
      //verify password
      let verifyPassword= await bcryptjs.compare(password,userObj.password);
      if(verifyPassword===false){
        res.status(200).send({message:"invalid password"})
      }
      //if password verified, create jwt
      else{
        //create jwt token
        let signedToken=jwt.sign(
          {
            username:username,
          },
          process.env.SECRET_KEY,{expiresIn:'7d'}
        )
        //send response
        res.status(200).send({message:"success",token:signedToken,user:userObj});
      }
    }
})

// update user details
exports.updateDetails=expressAsyncHandler(async(req,res)=>{
    const username=req.params.username;
    const data=req.body;
    let checkUser=await db.Users.findOne({
        where:{username:username}
    })
    if(checkUser!==null){
        await db.Users.update({bio:data.bio}, {
            where:{
            username:username
            }
        });
        res.send({message:"bio updated successfully"})
    } else{
        res.send({message:"user not found"})
    }
})

// delete user
exports.deleteUser=expressAsyncHandler(async(req,res)=>{
    const username=req.params.username;
    let checkUser=await db.Users.findOne({where:{username:username}})
    if(checkUser==null){
        res.send({message:"user not found"})
    } else{
        await db.Users.destroy({where:{username:checkUser.username}});
        res.send({message:"user deleted"})
    }
})

// forgot password
// import transporteer
const transporter=require('../custom_modules/transporter');
let otps={}
exports.forgotPassword=expressAsyncHandler(async(req,res)=>{
    //generate otp
    let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    console.log(otp); //176717
    otps[req.body.email] = otp;
    console.log(req.body.email);
    // defining mail options
    let mailOptions = {
      from: "mahesh",
      to: req.body.email,
      subject: "OTP to reset password for your instagram account",
      html:`<h2>Hi</h2> 
      <h3>The OTP to reset your password is </h3>
      <h1>${otp}</h1>`
    };
    // send email
    transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("err");
    } 
    else {
      console.log("email sent", info.messageId);
    }
    })
    res.status(200).send({message:"otp sent by email"})
});
  
//reset password
exports.resetPassword = expressAsyncHandler(async (req, res) => {
    // checking if the otp is valid
    //otp matches
    if (req.body.otp == otps[req.params.email]) {
      console.log("password verified");
      let hashedPassword = await bcryptjs.hash(req.body.password, 6);
      console.log("email", req.params.email);
      await db.Users.update({ password: hashedPassword },
        {
          where: {email: req.params.email},
        });
      res.status(200).send({ message: "success" });
    }
    // else
    else {
      res.status(200).send({ message: "Invalid OTP" });
    }
});


// get all details of user
exports.detailedViewuser=expressAsyncHandler(async(req,res)=>{
  const username=req.params.username;
  let response=await db.Users.findOne({
    where:{
      username:username
    },
    include:[
      {model:db.Posts}
    ]
  })
  res.send({message:"details of user",payload:response})
})




const storage=require('../custom_modules/cloudinary')
// check file upload
exports.FileUpload=expressAsyncHandler(async(req,res)=>{
  const {profileUrl}=req.body;
  try{
    const result=await storage.uploader.upload(profileUrl,{
      folder:'wal',
      width:300,
      height:300,
      crop:'scale'
    })
    res.send({result:result})

  } catch(err){
    res.send(err)

  }
})
