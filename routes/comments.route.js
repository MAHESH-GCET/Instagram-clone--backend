// create router application
const express=require('express');
const commentApi=express.Router();

// middleware
const verifyToken=require('../middlewares/verifyToken');

// body parser
commentApi.use(express.json());

// import controllors
const {
    AddComment
}=require('../controllors/comments.controllor')

// routes
// add comment
commentApi.post('/:username/feed/:postId/addcomment',verifyToken,AddComment)

// read comment
//commentApi.get('/:username/feed/:postId/comments',verifyToken,ReadComment)




module.exports=commentApi;