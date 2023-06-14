const expressAsynchandler=require('express-async-handler');
// import db
const db=require('../models/index');
const {Sequelize,Op}=require('sequelize');

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

// accept request
exports.AcceptRequest=expressAsynchandler(async(req,res)=>{
    // logged user
    const loggedUser=req.params.username;
    const from_username=req.body.from_username;

    // check if request exists
    const checkRequest=await db.Requests.findOne({
        where:{
           from_username:from_username,
           to_username:loggedUser 
        }
    })
    if(checkRequest==null){
        res.status(200).send({message:'Request doesnt exist'})
    }
    else{
        try{
        let updatedStatus='accepted'
        // accept request
        await db.Requests.update({status:'accepted'},{
            where:{
                from_username:from_username,
                to_username:loggedUser 
            }
        })
        console.log('request accepted (requests table)')
        // update loggeduser follower list
        await db.Followers.create({
            username:loggedUser,
            follower:from_username
        })
        console.log('updated followers (Followers table)')
        // update loggeduser followers count
        await db.Users.update({
            numberOfFollowers:Sequelize.literal('numberOfFollowers + 1')
        },{
            where:{
                username:loggedUser
            }
        })
        console.log('followers count updated')
        // update from_user following count
        await db.Users.update({
            numberOfFollowing:Sequelize.literal('numberOfFollowing + 1')
        },{
            where:{
                username:from_username
            }
        })
        console.log('following count updated')
        res.send({message:'success'})
    } catch(err){
        res.send({message:'Error'})
    }
    }
})




// reject requests of loggedin user
exports.RejectRequest=expressAsynchandler(async(req,res)=>{
    const loggedUser=req.params.username;
    const from_username=req.body.from_username;

    // check request exists
    const checkRequest=await db.Requests.findOne({
        where:{
            from_username:from_username,
            to_username:loggedUser
        }
    })
    if(checkRequest==null){
        res.status(200).send({message:'REquest doesnt exist'})
    } else {
        await db.Requests.destroy({
            where:{
                from_username:from_username,
                to_username:loggedUser
            }
        })
        res.status(200).send({message:'Rejected'})
    }
})


// get all followers
exports.GetFollowers=expressAsynchandler(async(req,res)=>{
    // loggged user
    const loggedUser=req.params.username;
    // check if followers exists
    let checkFollowers=await db.Followers.findAll({
        where:{
            username: loggedUser
        }
    })
    if(checkFollowers.length===0){
        res.status(200).send({message:"No FOllowers"})
    } else{
        res.status(200).send({message:"followers",followers:checkFollowers})
    }

})

// remove a follower
exports.RemoveFollower=expressAsynchandler(async(req,res)=>{
    // logged user
    const loggedUser=req.params.username;
    // follower user
    const followeruser=req.body.follower;

    // check if follower alctually followes user
    const checkFollower=await db.Followers.findOne({
        where:{
            follower:followeruser,
            username:loggedUser
        }
    })
    console.log(checkFollower)
    if(checkFollower==null){
        res.status(200).send({message:'Invalid Request'})
    }
    else{
        // remove follower
        await db.Followers.destroy({
            where:{
                follower:followeruser,
                username:loggedUser
            }
        })
        res.status(200).send({message:'removed'})
    }

})


// feed 
exports.Feed=expressAsynchandler(async(req,res)=>{
    // get all following users of the logged user
    const loggedUser=req.params.username;

    // get following users
    let followingUsers=await db.Followers.findAll({
        attributes:['username'],
        where:{
            follower:loggedUser,
        },
    })

    // local variable to store all the users
    const username=[]
    followingUsers.map((follower)=>{
        username.push(follower.username)
    })
    console.log("users",username)
    
    // get all posts of these  users
    try{
    let posts=await db.Users.findAll({
        where:{
            username:{
                [Op.in]:username
            },  
        },
        include:[
            {model:db.Posts,
            include:[
                {model:db.Comments},
                {model:db.Likes}
            ]}
        ]
    })
    res.status(200).send({message:'success'},{posts:posts})
    } catch(err){
        res.send({error:err})
    } 
})
