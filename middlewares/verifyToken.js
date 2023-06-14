//import jwt for testing token
const jwt=require("jsonwebtoken");
require('dotenv').config();
const verifyToken =(req,res,next)=>{
    //token verification logic
    //get bearer token from header req
    let bearerToken=req.headers.authorization;
    //check existence of bearer token
    if(bearerToken==undefined){
        res.send({message:"unauthorized access"})
    }
    //if bearer token exists, get token from bearer token
    else{
        let token=bearerToken.split(" ")[1]; //["bearer",token]
        try{
            //decode token
            let decoded=jwt.verify(token,process.env.SECRET_KEY);
            next();
        }
        catch(err){
            res.send({message:"please relogin"})
        }
    }
    
}
//export middleware
module.exports =verifyToken;