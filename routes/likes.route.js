// create router application
const express=require('express');
const likesApi=express.Router();

// import verifyToken middleware
const verifyToken=require('../middlewares/verifyToken');

// body parser
likesApi.use(express.json());

// controllors
const {
Dislike,
Like
}=require('../controllors/likes.controllor')
// routes
// like
likesApi.post('/:username/feed/:postId/like',verifyToken,Like);

// dislike
likesApi.delete('/:username/feed/:postId/dislike',verifyToken,Dislike);

// export app
module.exports=likesApi