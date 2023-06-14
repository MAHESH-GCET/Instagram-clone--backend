//import express
const express=require('express');
const verifyToken=require('../middlewares/verifyToken')

// create router application
const postApi=express.Router()

// body parser
postApi.use(express.json());

const {AddPost,
    EditPost,
    DeletePost
    } = require('../controllors/post.controllor')

// route

// add post
postApi.post('/:username/newPost',verifyToken,AddPost)

// edit post
postApi.put('/:username/profile/edit/:postId',verifyToken,EditPost);

// delete post
postApi.delete('/:username/profile/edit/:postId',verifyToken,DeletePost);

// export api
module.exports=postApi;