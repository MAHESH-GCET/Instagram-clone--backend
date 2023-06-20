// create router application
const express=require('express');
const commentApi=express.Router();

// middleware
const verifyToken=require('../../middlewares/verifyToken');

// body parser
commentApi.use(express.json());

// import handker
const {
    addCommentHandler
}=require('./commentsHandler')

// routes
// add comment
commentApi.post('/:username/feed/:postId/addcomment',verifyToken,addCommentHandler)


module.exports=commentApi;