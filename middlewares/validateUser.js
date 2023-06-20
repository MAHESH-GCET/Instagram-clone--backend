// library to handle validations
const joi=require('joi');

const validator=(schema,payload)=>schema.validate(payload,{
    abortEarly:false
})
// user validation schema
const userSchema=joi.object({
    username:joi.string().alphanum().min(3).max(15).required(),
    fullName:joi.string().min(5).max(20).required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    age:joi.number().min(18).max(30).required(),
    gender:joi.string().required(),
    profileUrl:joi.string()
})

// export validate registeration schema
exports.validateRegister=(req,res,next)=>{
    // validate req body
    const {error,value}=validator(userSchema,req.body)
    if(error){
        // handle validation errors
        const validationErrors=error.details.map((err)=>err.message);
        return res.status(400).json({errors:validationErrors})
    }
    next()
}