const { addComment } = require("../../controllors/commentsContollor");

// handler

// add comment
const addCommentHandler=async(req,res)=>{
    try{
        const result=await addComment(req);
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}

// export
module.exports={
    addCommentHandler
}