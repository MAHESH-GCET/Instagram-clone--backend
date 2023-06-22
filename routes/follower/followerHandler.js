const {
    sendRequest,
    acceptRequest,
    getRequests,
    rejectRequest,
    getFollowers,
    removeFollower,
    feed,
    getUsers,
    getFollowing,
    removeFollowing
}=require('../../controllors/followerControllor')

// req handlers
// send request
const sendRequestHandler=async(req,res)=>{
    try{
        const result=await sendRequest(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// get requests
const getRequestsHandler=async(req,res)=>{
    try{
        const result=await getRequests(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// accept requests
const acceptRequestHandler=async(req,res)=>{
    try{
        const result=await acceptRequest(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// reject requests
const rejectRequestHandler=async(req,res)=>{
    try{
        const result=await rejectRequest(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// get followers
const getFollowersHandler=async(req,res)=>{
    try{
        const result=await getFollowers(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// remove followers
const removeFollowerHandler=async(req,res)=>{
    try{
        const result=await removeFollower(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// feed
const getFeedHandler=async(req,res)=>{
    try{
        const result=await feed(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// get all users
const getUsersHandler=async(req,res)=>{
    try{
        const result=await getUsers(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// get following
const getFollowingHandler=async(req,res)=>{
    try{
        const result=await getFollowing(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// remove following
const removeFollowingHandler=async(req,res)=>{
    try{
        const result=await removeFollowing(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// export handler
module.exports={
    sendRequestHandler,
    getRequestsHandler,
    acceptRequestHandler,
    rejectRequestHandler,
    getFollowersHandler,
    removeFollowerHandler,
    getFeedHandler,
    getUsersHandler,
    getFollowingHandler,
    removeFollowingHandler
}