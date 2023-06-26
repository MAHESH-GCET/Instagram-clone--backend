// create router application
const express = require("express");
const likesApi = express.Router();

// import verifyToken middleware
const verifyToken = require("../../middlewares/verifyToken");

// body parser
likesApi.use(express.json());

// handlers
const { dislikeHandler, likeHandler, checkHandler } = require("./likesHandler");
// routes
// check
likesApi.get('/:username/feed/:postId/check',verifyToken,checkHandler)
// like
likesApi.post("/:username/feed/:postId/like", verifyToken, likeHandler);

// dislike
likesApi.delete("/:username/feed/:postId/dislike", verifyToken, dislikeHandler);

// export app
module.exports = likesApi;
