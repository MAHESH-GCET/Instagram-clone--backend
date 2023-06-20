// express async handler
const expressAsyncHandler=require('express-async-handler');

// db
const db=require('../models/index');
// import nodemailer
const transporter=require('../custom_modules/transporter');

// validation
const joi=require('joi');

// redis
const redis=require('redis')
const Queue=require('bull')

// node cron
const cron = require("node-cron")


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

// redis
// create redis client
const redisClient=redis.createClient({
    host: "localhost", // Redis server host
    port: 6379, // Redis server port
})
console.log('redis client connected')

// create new bull instance
const emailQueue=new Queue("email",{
    redis:{
        client:redisClient
    }
})
console.log('email queue created')

// send mail
const sendEmail=async(emailData)=>{
    
    // mail options
    let mailOptions={
        from:'Instagram',
        to:emailData.postEmail,
        subject:'New Comment',
        html:`<h5>${emailData.username} commented on your post </h5>
        <br>
        <p>${emailData.username} commented ${emailData.comment}</p>
        <br>
        <p>Checkout this link </p>`
    };

    // semd email
    transporter.sendMail(mailOptions,function(err,info){
        if (err) {
            console.log("error sending mail",err);
          } 
        else {
            console.log("email sent", info.messageId);
        }
    })
}

// Consumer to process the email sending task
emailQueue.process(async () => {
    await sendEmail(emailData);
});
// Set up error event listener for the email queue
emailQueue.on("error", (error) => {
    console.log("Email queue error:", error);
});
  

// add comment
exports.addComment=expressAsyncHandler(async(req,res)=>{
    // get username and post id
    const username=req.params.username;
    const postId=req.params.postId;

    // comment
    const comment=req.body
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
    const emailData={
        username:username,
        postEmail:postEmail,
        comment:comment.commentText
    }

    // send email

    cron.schedule("24 18 * * *", ()=>{
        sendEmail(emailData)
        console.log("Schheduling")
    }, {
        timezone: "Asia/Kolkata",
    })
    return ({message:"success"})
})

// // read comment
// exports.ReadComment=expressAsyncHandler(async(req,res)=>{

// })