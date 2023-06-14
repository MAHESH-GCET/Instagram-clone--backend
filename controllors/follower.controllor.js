const expressAsynchandler=require('express-async-handler');
// import db
const db=require('../models/index');

// get all users
exports.GetUsers = expressAsynchandler(async(req,res)=>{
    let users=await db.Users.findAll();
    if(users.length>0){
        res.send({message:"users",users:users})
    }
    else{
        res.send({message:"failed"})
    }
})

//  send request
exports.SendRequest=expressAsynchandler(async(req,res)=>{
    const fromUser=req.params.username;
    const toUser=req.body.to_username;
    const status='pending'
    // send request
    let request=await db.Requests.create({
        from_username:fromUser,
        to_username:toUser,
        status:status
    })
    res.status(200).send({message:'success',request:request})
})

// accept request


// get requests of logged in user
exports.GetRequests=expressAsynchandler(async(req,res)=>{
    // get requests from Requests 
    const loggedUser=req.params.username
    const status='pending'
    let requests=await db.Requests.findAll({
        where:{
            to_username: loggedUser,
            status:status
        },
        include:[
            {
                model:db.Users,
                attributes:['profileUrl']
            },
            
        ]
    })
    res.status(200).send({message:'success',requests:requests})
})

// reject requests of loggedin user

// remove a follower

// get all followers

// feed 
