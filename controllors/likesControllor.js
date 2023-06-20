// async handler
const expressAsyncHandler = require("express-async-handler");

// import db
const db = require("../models/index");
// controllors
exports.like = expressAsyncHandler(async (req) => {
  // user
  const user = req.params.username;
  const postId = req.params.postId;

  try {
    // check if already liked
    const checkLike = await db.Likes.findAll({
      attributes: ["username"],
      where: {
        postId: postId,
      },
    });

    let isLiked = false;
    checkLike.map((like) => {
      if (like.username === user) {
        isLiked = true;
      } else {
        isLiked = false;
      }
    });
    // if liked
    if (isLiked) {
      return { message: "Already Liked" };
    }
    // not liked
    else {
      await db.Likes.create({
        username: user,
        postId: postId,
      });
      return { message: "Liked" };
    }
  } catch (error) {
    throw new Error(error);
  }
});

// dislike
exports.dislike = expressAsyncHandler(async (req) => {
  // get username and postId
  const user = req.params.username;
  const postId = req.params.postId;

  try {
    // delete like field
    await db.Likes.destroy({
      where: {
        username: user,
        postId: postId,
      },
    });
    return ({ message: "disliked" });
  } catch (err) {
    throw new Error(err);
  }
});
