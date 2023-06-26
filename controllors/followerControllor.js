const expressAsynchandler = require("express-async-handler");
// import db
const db = require("../models/index");
const { Sequelize, Op } = require("sequelize");

// get all users
exports.getUsers = expressAsynchandler(async (req) => {
  try {
    let loggedUser = req.params.username;
    
    // get followers who are following loggedUser
    let allFollowers = await db.Followers.findAll({
      where: {
        follower: loggedUser,
      },
    });
    //console.log(allFollowers)
    // filter out usernames of followers
    let followers=[]
    allFollowers.map(follower=>{
      followers.push(follower.username)
    })

    // get the pending requests sent by the logged user
    let getPendingRequests=await db.Requests.findAll({
      where:{
        from_username:loggedUser,
        status:'pending'
      },
      attributes:['id','to_username']
    })
    // filter out the usernames from response
    let pendingRequests=[]
    getPendingRequests.map(request=>{
      pendingRequests.push(request.to_username)
    })
    
    // combine both arrays
    followers.push(...pendingRequests)
    //console.log(followers)
    // get all users who are not logged user and doesnt follow logged user
    let users = await db.Users.findAll({
      where: {
        username: {
          [Op.not]: loggedUser,
          [Op.notIn]:followers
        }
      },
      attributes:['username','profileUrl']
    });
    
    if (users.length > 0) {
      return { message: "users", users: users, pending: getPendingRequests};
    } else {
      return { message: "failed" };
    }
  } catch (error) {
    throw new Error(error);
  }
});

//  send request
exports.sendRequest = expressAsynchandler(async (req) => {
  const fromUser = req.params.username;
  const toUser = req.body.to_username;
  const status = "pending";
  try {
    // send request
    let request = await db.Requests.create({
      from_username: fromUser,
      to_username: toUser,
      status: status,
    });
    return { message: "success", request: request };
  } catch (error) {
    throw new Error(error);
  }
});

// get requests of logged in user
exports.getRequests = expressAsynchandler(async (req) => {
  // get requests from Requests
  const loggedUser = req.params.username;
  const status = "pending";
  try {
    let requests = await db.Requests.findAll({
      where: {
        to_username: loggedUser,
        status: status,
      },
      include: [
        {
          model: db.Users,
          attributes: ["profileUrl"],
        },
      ],
    });
    return { message: "success", requests: requests };
  } catch (error) {
    throw new Error(error);
  }
});

// accept request
exports.acceptRequest = expressAsynchandler(async (req) => {
  // logged user
  const loggedUser = req.params.username;
  const from_username = req.body.from_username;

  // check if request exists
  const checkRequest = await db.Requests.findOne({
    where: {
      from_username: from_username,
      to_username: loggedUser,
    },
  });
  if (checkRequest == null) {
    return { message: "Request doesnt exist" };
  } else {
    try {
      let updatedStatus = "accepted";
      // accept request
      await db.Requests.update(
        { status: "accepted" },
        {
          where: {
            from_username: from_username,
            to_username: loggedUser,
          },
        }
      );
      console.log("request accepted (requests table)");
      // update loggeduser follower list
      await db.Followers.create({
        username: loggedUser,
        follower: from_username,
      });
      console.log("updated followers (Followers table)");
      // update loggeduser followers count
      await db.Users.update(
        {
          numberOfFollowers: Sequelize.literal("numberOfFollowers + 1"),
        },
        {
          where: {
            username: loggedUser,
          },
        }
      );
      console.log("followers count updated");
      // update from_user following count
      await db.Users.update(
        {
          numberOfFollowing: Sequelize.literal("numberOfFollowing + 1"),
        },
        {
          where: {
            username: from_username,
          },
        }
      );
      console.log("following count updated");
      return { message: "success" };
    } catch (err) {
      throw new Error(err);
    }
  }
});

// reject requests of loggedin user
exports.rejectRequest = expressAsynchandler(async (req) => {
  const loggedUser = req.params.username;
  const from_username = req.params.from_username;

  try {
    // check request exists
    const checkRequest = await db.Requests.findOne({
      where: {
        from_username: from_username,
        to_username: loggedUser,
      },
    });
    if (checkRequest == null) {
      return { message: "REquest doesnt exist" };
    } else {
      await db.Requests.destroy({
        where: {
          from_username: from_username,
          to_username: loggedUser,
        },
      });
      return { message: "Rejected" };
    }
  } catch (error) {
    throw new Error(error);
  }
});

// get all followers
exports.getFollowers = expressAsynchandler(async (req) => {
  // loggged user
  const loggedUser = req.params.username;
  // check if followers exists
  let checkFollowers = await db.Followers.findAll({
    where: {
      username: loggedUser,
    },
  });

  // get all users
  let followerDetails = [];
  await Promise.all(
    checkFollowers.map(async (follower) => {
      let followerDetail = await db.Users.findOne({
        where: {
          username: follower.follower,
        },
        attributes: ["username", "profileUrl"],
      });
      followerDetails.push(followerDetail.dataValues);
    })
  );
  return { message: "followers", followers: followerDetails };
});

// remove a follower
exports.removeFollower = expressAsynchandler(async (req) => {
  // logged user
  const loggedUser = req.params.username;
  // follower user
  const followeruser = req.params.followerUser;

  // check if follower alctually followes user
  const checkFollower = await db.Followers.findOne({
    where: {
      follower: followeruser,
      username: loggedUser,
    },
  });
  console.log(checkFollower);
  if (checkFollower == null) {
    return { message: "Invalid Request" };
  } else {
    // remove follower
    await db.Followers.destroy({
      where: {
        follower: followeruser,
        username: loggedUser,
      },
    });
    return { message: "removed" };
  }
});

// get following
exports.getFollowing = expressAsynchandler(async (req) => {
  // logged user
  const loggedUser = req.params.username;
  // get all following users
  const followingUsers = await db.Followers.findAll({
    where: {
      follower: loggedUser,
    },
    include: [{ model: db.Users }],
  });
  // get all users data who are following logged user
  let followingDetails = [];
  await Promise.all(
    followingUsers.map(async (following) => {
      let followingDetail = await db.Users.findOne({
        where: {
          username: following.username,
        },
        attributes: ["username", "profileURL"],
      });
      followingDetails.push(followingDetail.dataValues);
    })
  );
  return { message: "following", following: followingDetails };
});

// remove following
exports.removeFollowing = expressAsynchandler(async (req) => {
  // get logged user
  const loggedUser = req.params.username;
  // get following username
  const followingUser = req.params.followingUser;
  // remove folowing
  await db.Followers.destroy({
    where: {
      follower: loggedUser,
      username: followingUser,
    },
  });
  return { message: "removed" };
});

// feed
exports.feed = expressAsynchandler(async (req) => {
  // get all following users of the logged user
  const loggedUser = req.params.username;

  // get following users
  let followingUsers = await db.Followers.findAll({
    attributes: ["username"],
    where: {
      follower: loggedUser,
    },
  });

  // local variable to store all the users
  const username = [];
  followingUsers.map((follower) => {
    username.push(follower.username);
  });
  console.log("users", username);

  // get all posts of these  users
  try {
    let posts = await db.Posts.findAll({
      where: {
        username: {
          [Op.in]: username,
        },
      },
      include: [
        { model: db.Users, attributes: ["profileURL"] },
        { model: db.Comments },
        { model: db.Likes},
      ],
    });
    return { message: "success", posts: posts };
  } catch (err) {
    throw new Error(err);
  }
});
