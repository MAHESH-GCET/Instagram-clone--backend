const {
    userRegistration,
    userLogin,
    userDetails,
    updateDetails,
    deleteUser,
    userDetailedView,
    resetPassword,
    forgotPassword
} = require('../../controllors/userControllor')

// register handler
const registerHandler=async(req,res)=>{
    try{
        const result=await userRegistration(req)
        res.status(201).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// login handler
const loginHandler=async(req,res)=>{
    try{
        const result=await userLogin(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// user details
const userHandler=async(req,res)=>{
    try{
        const result=await userDetails(req)
        res.status(200).send(result)
    } catch(error) {
        res.status(400).send({'error':error.message})
    }
}

// update user details
const userDetailsHandler=async(req,res)=>{
    try{
        const result=await updateDetails(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// delete user
const deleteUserHandler=async(req,res)=>{
    try{
        const result=await deleteUser(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// user detailed view
const userDetailedViewHandler=async(req,res)=>{
    try{
        const result=await userDetailedView(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// forgot password
const forgotPasswordHandler=async(req,res)=>{
    try{
        const result=await forgotPassword(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}

// reset password
const resetPasswordHandler=async(req,res)=>{
    try{
        const result=await resetPassword(req)
        res.status(200).send(result)
    } catch(error){
        res.status(400).send({'error':error.message})
    }
}
// expport handler
module.exports={
    registerHandler,
    loginHandler,
    userHandler,
    userDetailsHandler,
    deleteUserHandler,
    userDetailedViewHandler,
    forgotPasswordHandler,
    resetPasswordHandler
}