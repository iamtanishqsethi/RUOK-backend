const jwt=require('jsonwebtoken')
const User = require('../models/user.js')

const userAuth=async (req,res,next)=>{
    try{
        //read token from cookies
        const cookies=req.cookies;
        const {token} = cookies

        //validate token
        if(!token){
            throw new Error("Token not found")
        }

        //get id from token and check user
        const decodeValue=await jwt.verify(token,process.env.JWT_KEY)
        const user=await User.findById(decodeValue._id)
        if(!user){
            throw new Error("User not found")
        }

        //set user in req object and pass control to next middleware
        req.user=user
        next()
    }
    catch(err){
        res.status(404).send( err.message);
    }
}

module.exports = userAuth;