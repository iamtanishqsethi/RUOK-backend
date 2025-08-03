const express = require('express');
const router = express.Router()
const userAuth=require('../middleware/userAuth')
const ToolFeedback = require('../models/toolFeedback');
const CheckIn = require('../models/checkIn');

router.post('/new',userAuth,async (req,res)=>{
    try{
        const userId=req.user._id
        const {toolName,rating,checkIn}=req.body

        //verify checkin id
        const isCheckin=await CheckIn.findById(checkIn)
        if(!isCheckin){
            return res.status(404).json({message:"Invalid Checkin Id"})
        }

        const newFeedback=await new ToolFeedback({
            userId,
            toolName,
            rating,
            checkIn
        })

        await newFeedback.save()

        await newFeedback.populate({
            path:'checkIn',
            populate:[
                {path:'emotion'},
                {path:'activityTag'},
                {path:'placeTag'},
                {path:'peopleTag'}
            ]
        })


        res.status(200).json({message:"Successfully created new Feedback",data:newFeedback})
    }

    catch(err){
            res.status(500).json({message:"Internal Server Error"})

    }
})

router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const userId=req.user._id
        const feedbacks=await ToolFeedback.find({userId}).populate({
            path: 'checkIn',
            populate: [
                { path: 'emotion' },
                { path: 'activityTag' },
                { path: 'placeTag' },
                { path: 'peopleTag' }
            ]
        });


        res.status(200).json({message:"Fetched All Feedbacks",data:feedbacks})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})
module.exports = router;