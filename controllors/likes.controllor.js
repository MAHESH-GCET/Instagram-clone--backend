// async handler
const expressAsyncHandler=require('express-async-handler');

// import db
const db=require('../models/index');
// controllors
exports.Like=expressAsyncHandler(async(req,res)=>{
    // user
    const user=req.params.username;
    const postId=req.params.postId;

    // check if already liked
    const checkLike=await db.Likes.findAll({
        attributes:['username'],
        where:{
            postId:postId
        }
    })
    
    let isLiked=false;
    checkLike.map((like)=>{
        if(like.username===user){
            isLiked=true
        } else{
            isLiked=false
        }
    })
    // if liked
    if(isLiked){
        res.send({message:"Already Liked"})
    } 
    // not liked
    else{
        await db.Likes.create({
            username:user,
            postId:postId
        })
        res.status(200).send({message:"Liked"})
    }

})

// dislike
exports.Dislike=expressAsyncHandler(async(req,res)=>{
    // get username and postId
    const user=req.params.username;
    const postId=req.params.postId;

    // delete like field
    await db.Likes.destroy({
        where:{
            username:user,
            postId:postId
        }
    })
    res.status(200).send({message:'disliked'})
})