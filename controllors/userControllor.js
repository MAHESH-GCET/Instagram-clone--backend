// import required modules
// library to handle async requests
const expressAsyncHandler=require('express-async-handler');
// library to hash password
const bcryptjs=require('bcryptjs');

// authentication library
const jwt=require('jsonwebtoken');
// import database
const db=require('../models/index');
// image upload to cloud
const storage=require('../custom_modules/cloudinary')
// import transporter (node mailer)
const transporter=require('../custom_modules/transporter');


// user Registration
exports.userRegistration=expressAsyncHandler(async(req)=>{
    const data=req.body
    try{
      // check if username exists
      const checkUser= await db.Users.findAll({
      where:{
        username:req.body.username
      }
      })
      if (checkUser.length!==0){
        return {message:'user already registered'}
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
            profileURL:'https://www.wissetuinen.nl/wp-content/uploads/2016/01/profiel-icoon.jpg'
        })
        return {message:"user registered"}
      }

    } catch(error){
      throw new Error(error)
    }
        
})

// user Login
exports.userLogin=expressAsyncHandler(async(req)=>{
    let {username,password}=req.body;
    try{
    //check if employee exists
    let userObj=await db.Users.findOne({
      where:{username:username}
    });
    if(userObj==null){
      return {message:'User not found'}
    }
    //if employee exists
    else{
      //verify password
      let verifyPassword= await bcryptjs.compare(password,userObj.password);
      if(verifyPassword===false){
        return {message:'Invalid password'}
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
        return ({message:"success",token:signedToken,user:userObj});
      }
    }
    } catch (error){
      throw new Error(error)
    }
})

// user details
exports.userDetails=expressAsyncHandler(async(req)=>{
  const username=req.params.username;
  try{
    let checkUser=await db.Users.findOne({
      where:{username:username}
    })
    if(checkUser!==null){
      return ({message:"success",user:checkUser})
    } else{
      return {message:'user not found'}
    }
  } catch(error){
    throw new Error(error)
  }
  
})

// update user details
exports.updateDetails=expressAsyncHandler(async(req)=>{
    const username=req.params.username;
    const {newProfile,bio}=req.body;
    try{
      let checkUser=await db.Users.findOne({
        where:{username:username}
      })
    
      if(checkUser!==null){
        if(newProfile.length===0){
          await db.Users.update({bio:bio}, {
            where:{
            username:username
          }
          });
          return ({message:'success'})
        }
        else{
          const result=await storage.uploader.upload(newProfile,{
            folder:'wal',
            width:300,
            height:300,
            crop:'scale'
          })
          const newProfileUrl=result.secure_url;
          await db.Users.update({
            bio:bio,
            profileURL:newProfileUrl},{
              where:{
                username:username
              }
            }
          )
          return ({message:'success'})
        } 
      } 
      else{
        return ({message:"user not found"})
      }
    } 
    catch(error){
      throw new Error(error)
    }
})

// delete user
exports.deleteUser=expressAsyncHandler(async(req)=>{
    const username=req.params.username;
    try{
      let checkUser=await db.Users.findOne({where:{username:username}})
      if(checkUser!==null){
        await db.Users.destroy({where:{username:checkUser.username}});
        return ({message:"user deleted"})
      } 
      else{
        return ({message:"user not found"})
      }
    } catch(error){
      throw new Error(error)
    }
    
})

// forgot password
let otps={}
exports.forgotPassword=expressAsyncHandler(async(req)=>{
  try{
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
    return ({message:"otp sent by email"})
  } 
  catch(error){
    throw new Error(error)
  }
    
});
  
//reset password
exports.resetPassword = expressAsyncHandler(async (req) => {
  try{
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
      return ({ message: "success" });
    }
    // else
    else {
      return ({ message: "Invalid OTP" });
    }
  } 
  catch(error){
    throw new Error(error)
  }
    
});


// get all details of user
exports.userDetailedView=expressAsyncHandler(async(req)=>{
  const username=req.params.username;
  try{
    let response=await db.Posts.findAll({
      where:{
        username:username
      },
      include:[
        {model:db.Comments},
        {model:db.Likes}
      ]
    })
    return ({message:"details of user",payload:response})
  } 
  catch(error){
    throw new Error(error)
  }
  
})





// check file upload
// exports.FileUpload=expressAsyncHandler(async(req,res)=>{
//   const {profileUrl}=req.body;
//   try{
//     const result=await storage.uploader.upload(profileUrl,{
//       folder:'wal',
//       width:300,
//       height:300,
//       crop:'scale'
//     })
//     res.send({result:result})

//   } catch(err){
//     res.send(err)

//   }
// })
