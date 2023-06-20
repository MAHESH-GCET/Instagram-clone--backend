const express=require('express');

// follower router
const followApi=express.Router();

// token middleware
const verifyToken=require('../../middlewares/verifyToken');

const {
    sendRequestHandler,
    acceptRequestHandler,
    getRequestsHandler,
    rejectRequestHandler,
    getFollowersHandler,
    removeFollowerHandler,
    getUsersHandler,
    getFeedHandler
}=require('./followerHandler')

// routes
// all users
followApi.get('/users',verifyToken,getUsersHandler);

// send request
followApi.post('/:username/users/request',verifyToken,sendRequestHandler)

// get requests
followApi.get('/:username/requests',verifyToken,getRequestsHandler)

// accept request
followApi.put('/:username/requests/accept',verifyToken,acceptRequestHandler);

// reject request
followApi.delete('/:username/requests/reject',verifyToken,rejectRequestHandler);

// get followers
followApi.get('/:username/followers',verifyToken,getFollowersHandler)

// remove followers
followApi.delete('/:username/followers/remove',verifyToken,removeFollowerHandler)

// feed
followApi.get('/:username/feed',verifyToken,getFeedHandler)

// export api
module.exports=followApi;