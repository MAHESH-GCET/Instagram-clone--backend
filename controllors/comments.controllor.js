// express async handler
const expressAsyncHandler=require('express-async-handler');

// db
const db=require('../models/index');
// import nodemailer
const transporter=require('../custom_modules/transporter');

// validation
const joi=require('joi');

// comment validation
const commentSchema=joi.object({
    commentText:joi.string().required().trim().min(1).max(255)
})

// Validate the comment object
const validateComment = (comment) => {
    const { error, value } = commentSchema.validate(comment);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return value;
  };

// add comment
exports.AddComment=expressAsyncHandler(async(req,res)=>{
    // get username and post id
    const username=req.params.username;
    const postId=req.params.postId;

    // comment
    const comment=req.body;
    // validate comment
    const validatedComment = validateComment(comment);
    console.log(validatedComment);
    // post comment
    let postComment=await db.Comments.create({
        username:username,
        postId:postId,
        commentText:comment.commentText
    })
    // get user of that post
    const post=await db.Posts.findOne({
        attributes:['username'],
        where:{
            postId:postId
        },
        include:[
            {
                model:db.Users,
                attributes:['email']
            }
        ]
    })
    const postEmail=post.User.email;
    console.log(postEmail)
    
    // send mail
    let mailOptions={
        from:'Instagram',
        to:postEmail,
        subject:'New Comment',
        html:`<h5>${username} commented on your post </h5>
        <br>
        <p>${username} commented ${comment.commentText}</p>
        <br>
        <p>Checkout this link </p>`
    };
    transporter.sendMail(mailOptions,function(err,info){
        if (err) {
            console.log("err");
          } 
        else {
            console.log("email sent", info.messageId);
        }
    })
    res.status(200).send({message:"success"})
})

// // read comment
// exports.ReadComment=expressAsyncHandler(async(req,res)=>{

// })