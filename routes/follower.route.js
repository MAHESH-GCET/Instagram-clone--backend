const express=require('express');

// follower router
const followApi=express.Router();

// token middleware
const verifyToken=require('../middlewares/verifyToken');

const {
    GetUsers,
    SendRequest,
    GetRequests

}=require('../controllors/follower.controllor');

// routes
// all users
followApi.get('/users',verifyToken,GetUsers);

// send request
followApi.post('/:username/users/request',verifyToken,SendRequest)

// get requests
followApi.get('/:username/requests',verifyToken,GetRequests)
// export api
module.exports=followApi;