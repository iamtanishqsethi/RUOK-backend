const express=require('express');
const router=express.Router();
const Emotion = require('../models/emotion');
const userAuth=require('../middleware/userAuth')


//this api is for server admin only
//TODO: disable this api end point for general user
router.post('/new',userAuth,async (req,res)=>{
    const {title,description,type}=req.body
    try{
        const existingEmotion =await Emotion.findOne({title})
        if(existingEmotion){
            return res.status(400).json({message: 'Emotion already exists'})
        }
        const emotion = new Emotion({
            title,
            description,
            type
        })
        await emotion.save()
        res.status(200).json({message:"Emotion created successfully ",emotion})

    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const allEmotions=await Emotion.find()
        res.status(200).json({message:"Fetched All emotions",data:allEmotions})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
