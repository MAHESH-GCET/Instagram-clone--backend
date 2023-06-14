const express=require('express');

// follower router
const followApi=express.Router();

// token middleware
const verifyToken=require('../middlewares/verifyToken');

const {
    GetUsers,
    SendRequest,
    GetRequests,
    AcceptRequest,
    RejectRequest,
    GetFollowers,
    RemoveFollower,
    Feed

}=require('../controllors/follower.controllor');

// routes
// all users
followApi.get('/users',verifyToken,GetUsers);

// send request
followApi.post('/:username/users/request',verifyToken,SendRequest)

// get requests
followApi.get('/:username/requests',verifyToken,GetRequests)

// accept request
followApi.put('/:username/requests/accept',verifyToken,AcceptRequest);

// reject request
followApi.delete('/:username/requests/reject',verifyToken,RejectRequest);

// get followers
followApi.get('/:username/followers',verifyToken,GetFollowers)

// remove followers
followApi.delete('/:username/followers/remove',verifyToken,RemoveFollower)

// feed
followApi.get('/:username/feed',verifyToken,Feed)

// export api
module.exports=followApi;