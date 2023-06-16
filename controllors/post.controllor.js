const expressAsyncHandler=require('express-async-handler');
// import database
const db=require('../models/index');
// library to handle validations
const joi=require('joi');

// cloudinary
const cloudinary=require('../custom_modules/cloudinary');

// check user function
const checkUser=async(username)=>{
    let userExists=await db.Users.findOne({
        where:{
            username:username
        }
    })
    if(userExists){
        return true
    }
    else{
        return false
    }
}

// to handle posts count
let updatedPostCount=null;
const incrementCount=async(username)=>{
    let userDb=await db.Users.findOne({
        where:{username:username}
    })
    updatedPostCount=userDb.dataValues.numberOfPosts+1
    // update count
    await db.Users.update({numberOfPosts:updatedPostCount},{
        where:{
            username:username
        }
    })
}

const decrementCount=async(username)=>{
    let userDb=await db.Users.findOne({
        where:{username:username}
    })
    console.log(userDb)
    updatedPostCount=userDb.dataValues.numberOfPosts-1
    // update count
    await db.Users.update({numberOfPosts:updatedPostCount},{
        where:{
            username:username
        }
    })
}

// add post
exports.AddPost=expressAsyncHandler(async(req,res)=>{
    const {image,caption}=req.body;
    const usernameParams=req.params.username
    if(checkUser(usernameParams)){
        // upload image to cloudinary
        try{
            let postUrl=''
            const postUpload=await cloudinary.uploader.upload(image,{
                folder:'wal',
                width:400,
                height:500,
                crop:'fill'
            })
            if(postUpload){
                postUrl=postUpload.secure_url;
            }
            //postUrl='https://www.littlethings.info/wp-content/uploads/2014/04/dummy-image-green-e1398449160839.jpg'
            let post=await db.Posts.create({
                username:usernameParams,
                caption:caption,
                imageUrl:postUrl
            })
            incrementCount(usernameParams);
            res.status(200).send({message:"success",post:post})
        } catch(err){
            console.log(err)
        }
    } else{
        res.status(404).send({message:"User not found"})
    }
    
})

// edit post
exports.EditPost=expressAsyncHandler(async(req,res)=>{
    const {caption}=req.body;
    const usernameParams=req.params.username
    const postId=req.params.postId
    // check user
    if(checkUser(usernameParams)===true){
        await db.Posts.update({caption:caption},{
            where:{
                postId:postId,
                username:usernameParams
            }
        })
        res.send({message:"success"})
    }
    else{
        res.send({message:"USer not found"})
    }

})

// delete post
exports.DeletePost=expressAsyncHandler(async(req,res)=>{
    const username=req.params.username;
    const postId=req.params.postId;
    // check user
    if(checkUser(username)){
        // delete post
        await db.Posts.destroy({
            where:{
                postId:postId,
                username:username
            }
        })
        decrementCount(username);
        res.send({message:"deleted"})
    } else{
        res.send({message:'User not found'})
    }
})