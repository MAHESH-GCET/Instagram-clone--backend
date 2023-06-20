// create router application
const express = require("express");
const likesApi = express.Router();

// import verifyToken middleware
const verifyToken = require("../../middlewares/verifyToken");

// body parser
likesApi.use(express.json());

// handlers
const { dislikeHandler, likeHandler } = require("./likesHandler");
// routes
// like
likesApi.post("/:username/feed/:postId/like", verifyToken, likeHandler);

// dislike
likesApi.delete("/:username/feed/:postId/dislike", verifyToken, dislikeHandler);

// export app
module.exports = likesApi;
