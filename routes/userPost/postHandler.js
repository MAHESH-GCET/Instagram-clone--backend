const {
    addPost,
    editPost,
    deletePost,
    getPostDetails
}= require('../../controllors/postControllor')

// get post details
const getPostDetailsHandler=async(req,res)=>{
    try{
        const result=await getPostDetails(req)
        res.status(200).send(result)
    }
    catch(error){
        res.status(400).send({'error':error.message})
    }
}
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
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// delete post handler
const deletePostHandler=async(req,res)=>{
    try{
        const result=await deletePost(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}
// export handlers
module.exports={
    addPostHandler,
    editPostHandler,
    deletePostHandler,
    getPostDetailsHandler
}