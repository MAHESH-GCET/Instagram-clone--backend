const {
    like,
    dislike,
    checkLike
}=require('../../controllors/likesControllor')

// handlers
// check like
const checkHandler=async(req,res)=>{
    try{
        const result=await checkLike(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
// like
const likeHandler=async(req,res)=>{
    try{
        const result=await like(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// dislike
const dislikeHandler=async(req,res)=>{
    try{
        const result=await dislike(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// export
module.exports={
    likeHandler,
    dislikeHandler,
    checkHandler
}