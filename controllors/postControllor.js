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
// get post details
exports.getPostDetails=expressAsyncHandler(async(req)=>{
    const postId=req.params.postId;

    // get post details
    let postDetails=await db.Posts.findAll({
        where:{
            postId:postId
        },
        attributes:['imageUrl','username'],
        include:[
            {model:db.Users,attributes:['profileURL']},
            {model:db.Comments,include:[{model:db.Users,attributes:['profileURL']}]},
            {model:db.Likes,include:[{model:db.Users,attributes:['profileURL']}]},
        ]
        
    })
    if(postDetails.length>0){
        return ({post:postDetails})
    }
    else{
        return ({message:'failed'})
    }
})
// add post
exports.addPost=expressAsyncHandler(async(req)=>{
    const {image,caption}=req.body;
    const usernameParams=req.params.username
    if(checkUser(usernameParams)){
        // upload image to cloudinary
        try{
            let postUrl=''
            const postUpload=await cloudinary.uploader.upload(image,{
                folder:'wal',
                width:400,
                height:400
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
            return ({message:"success",post:post})
        } catch(err){
            throw new Error(err)
        }
    } else{
        return ({message:"User not found"})
    }
    
})

// edit post
exports.editPost=expressAsyncHandler(async(req,res)=>{
    const {caption}=req.body;
    const usernameParams=req.params.username
    const postId=req.params.postId
    try{
        // check user
        if(checkUser(usernameParams)){
            await db.Posts.update({caption:caption},{
            where:{
                postId:postId,
                username:usernameParams
            }
            })
            return ({message:"success"})
        }
        else{
            return ({message:"USer not found"})
        }
    } 
    catch(error){
        throw new Error(error)
    }

})

// delete post
exports.deletePost=expressAsyncHandler(async(req,res)=>{
    const username=req.params.username;
    const postId=req.params.postId;
    try{
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
            return ({message:"deleted"})
        } else{
            return ({message:'User not found'})
        }
    }
    catch(error){
        throw new Error(error)
    }
   
})