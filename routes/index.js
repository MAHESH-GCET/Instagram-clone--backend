// import express
const router=require('express')();

// import user app
const userApp=require('../routes/user/userRoute')
// import post app
const postApi=require('../routes/userPost/postRoute')
// import follower app
const followApi=require('../routes/follower/followerRoute')
// import comments app
const commentApi=require('../routes/comments/commentsRoute')
// import likes app
const likesApi=require('../routes/likes/likesRoute')
// middllewares
router.use('/',userApp)
router.use('/',postApi)
router.use('/',followApi)
router.use('/',likesApi)
router.use('/',commentApi)
// export
module.exports=router;