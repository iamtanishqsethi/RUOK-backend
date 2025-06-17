const express=require('express');
const router=express.Router();
const Place = require('../models/placeTag');
const userAuth=require('../middleware/userAuth')

router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const userId = req.user._id;
        const allPlaceTags=await Place.find({userId:userId})
        res.status(200).json({message:"Fetched All places",data:allPlaceTags})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
