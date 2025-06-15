const express=require('express')
const router=express.Router()
const userAuth=require('../middleware/userAuth')
const Checkin=require('../models/checkIn')
const Emotion=require('../models/emotion')
const ActivityTag=require('../models/activityTag')
const PlaceTag=require('../models/placeTag')
const PeopleTag=require('../models/peopleTag')

router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const userId=req.user._id
        const checkIn=await Checkin.find({userId}).populate('emotion activityTag placeTag peopleTag')
        res.status(200).json({message:"Fetched All checkIn",data:checkIn})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})



router.post('/new',userAuth,async (req,res)=>{

    try{
        const userId=req.user._id
        const {emotion,description,activityTag,placeTag,peopleTag}=req.body

        //validate the emotion first
        const validEmotion=await Emotion.findOne({title:emotion})

        if(!validEmotion){
            return res.status(400).send({message:"Not a valid emotion"})
        }

        //validate tags , if new tag create a new one for user
        let activityTagId=null
        let placeTagId=null
        let peopleTagId=null

        if(activityTag){
            //need to check the value so trim it down to lowercase
            const normalizedTagValue=activityTag.toLowerCase().trim()
            let existingActivityTag=await ActivityTag.findOne({title:normalizedTagValue,userId})

            if(!existingActivityTag){
                const newTag=new ActivityTag({
                    title:normalizedTagValue,
                    userId:userId
                })
                existingActivityTag=await newTag.save()
            }
            activityTagId=existingActivityTag._id
        }
        if(placeTag){
            const normalizedTagValue=placeTag.toLowerCase().trim()
            let existingPlaceTag=await PlaceTag.findOne({title:normalizedTagValue,userId})

            if(!existingPlaceTag){
                const newTag=new PlaceTag({
                    title:normalizedTagValue,
                    userId:userId
                })
                existingPlaceTag=await newTag.save()
            }
            placeTagId=existingPlaceTag._id
        }
        if(peopleTag){
            const normalizedTagValue=peopleTag.toLowerCase().trim()
            let existingPeopleTag=await PeopleTag.findOne({title:normalizedTagValue,userId})

            if(!existingPeopleTag){
                const newTag=new PeopleTag({
                    title:normalizedTagValue,
                    userId:userId
                })
                existingPeopleTag=await newTag.save()
            }
            peopleTagId=existingPeopleTag._id
        }

        //create new emotion and populate the data
        const newCheckin = await new Checkin({
            userId,
            description,
            emotion: validEmotion._id,
            activityTag: activityTagId,
            placeTag: placeTagId,
            peopleTag: peopleTagId,
        }).populate('emotion activityTag placeTag peopleTag');
        await newCheckin.save()

        res.status(200).json({message:"Successfully created new Checkin",data:newCheckin})

    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})


module.exports=router