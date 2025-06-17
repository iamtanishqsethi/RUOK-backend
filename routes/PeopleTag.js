const express=require('express');
const router=express.Router();
const People = require('../models/peopleTag');
const userAuth=require('../middleware/userAuth')

router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const userId = req.user._id;
        const allPeopleTags=await People.find({userId:userId})
        res.status(200).json({message:"Fetched All People",data:allPeopleTags})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
