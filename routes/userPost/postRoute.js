//import express
const express=require('express');
const verifyToken=require('../../middlewares/verifyToken')

// create router application
const postApi=express.Router()

// body parser
postApi.use(express.json());

const {
    addPostHandler,
    deletePostHandler,
    editPostHandler
}=require('./postHandler')
// route

// add post
postApi.post('/:username/newPost',verifyToken,addPostHandler)

// edit post
postApi.put('/:username/profile/edit/:postId',verifyToken,editPostHandler);

// delete post
postApi.delete('/:username/profile/edit/:postId',verifyToken,deletePostHandler);

// export api
module.exports=postApi;