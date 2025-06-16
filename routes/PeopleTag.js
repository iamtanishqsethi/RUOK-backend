const express=require('express');
const router=express.Router();
const People = require('../models/peopleTag');
const userAuth=require('../middleware/userAuth')


//this api is for server admin only
//TODO: disable this api end point for general user

router.get('/getAll-peopleTags',userAuth,async (req,res)=>{
    try{
        const allPeopleTags=await People.find()
        res.status(200).json({message:"Fetched All emotions",data:allPeopleTags})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
