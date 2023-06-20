const {
    addPost,
    editPost,
    deletePost
}= require('../../controllors/postControllor')

// add post handler
const addPostHandler=async(req,res)=>{
    try{
        const result=await addPost(req)
        res.status(201).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}
// edit post handler
const editPostHandler=async(req,res)=>{
    try{
        const result=await editPost(req)
        res.status(201).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// delete post handler
const deletePostHandler=async(req,res)=>{
    try{
        const result=await deletePost(req)
        res.status(201).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}
// export handlers
module.exports={
    addPostHandler,
    editPostHandler,
    deletePostHandler
}