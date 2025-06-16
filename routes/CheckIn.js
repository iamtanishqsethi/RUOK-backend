const express=require('express')
const mongoose = require('mongoose')
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

router.delete('/delete-checkin/:id',userAuth,async (req,res)=>{
    const checkinId = req.params.id
    try {
        const deletedCheckin = await Checkin.findOneAndDelete({_id:checkinId})
        res.status(200).json({message:"Deleted checkIn",data:deletedCheckin})
    }catch (err){
        res.status(500).json({message:"Internal Server Error In Deleting Checkin"})
    }
})

router.put('/update-checkin/:id', userAuth, async (req, res) => {
    const checkinId = req.params.id;
    const userId = req.user._id;
    const { emotion, description, activityTag, placeTag, peopleTag } = req.body;

    try {
        const validEmotion = await Emotion.findOne({ title: emotion });
        if (!validEmotion) {
            return res.status(400).send({ message: "Not a valid emotion" });
        }

        let activityTagId = null;
        let placeTagId = null;
        let peopleTagId = null;

        if (activityTag) {
            const normalizedTagValue = activityTag.toLowerCase().trim();
            let existing = await ActivityTag.findOne({ title: normalizedTagValue, userId });
            if (!existing) {
                const newTag = new ActivityTag({ title: normalizedTagValue, userId });
                existing = await newTag.save();
            }
            activityTagId = existing._id;
        }

        if (placeTag) {
            const normalizedTagValue = placeTag.toLowerCase().trim();
            let existing = await PlaceTag.findOne({ title: normalizedTagValue, userId });
            if (!existing) {
                const newTag = new PlaceTag({ title: normalizedTagValue, userId });
                existing = await newTag.save();
            }
            placeTagId = existing._id;
        }

        if (peopleTag) {
            const normalizedTagValue = peopleTag.toLowerCase().trim();
            let existing = await PeopleTag.findOne({ title: normalizedTagValue, userId });
            if (!existing) {
                const newTag = new PeopleTag({ title: normalizedTagValue, userId });
                existing = await newTag.save();
            }
            peopleTagId = existing._id;
        }

        const updateCheckin = await Checkin.findOneAndUpdate(
            { _id: checkinId },
            {
                description,
                emotion: validEmotion._id,
                activityTag: activityTagId,
                placeTag: placeTagId,
                peopleTag: peopleTagId,
            }
        );

        if (!updateCheckin) {
            return res.status(404).json({ message: "Checkin not found" });
        }

        res.status(200).json({ message: "Checkin updated successfully", updatedCheckin: updateCheckin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error In Updating Checkin" });
    }
});

router.get('/get-checkins-by-tags', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { activityTag, placeTag, peopleTag } = req.query;

        let activitiesTagIds =[];
        let placeTagIds =[]
        let peopleTagIds=[]

        const processTags=async (tagString,TagModel)=> {
            if(!tagString) return [];
            const tagTitles = tagString.split(',').map(tag=>tag.toLowerCase().trim()).filter(Boolean);
            if(tagTitles.length === 0) return []

            const foundTags = await TagModel.find({userId:userId, title: {$in : tagTitles}})
            return foundTags.map(tag=>tag._id);
        }

        activitiesTagIds = await processTags(activityTag, ActivityTag);
        placeTagIds = await processTags(placeTag, PlaceTag);
        peopleTagIds = await processTags(peopleTag, PeopleTag);

        if (activitiesTagIds.length > 0){
            query.activityTag = { $in: activityTagIds };
        }
        if (placeTagIds.length > 0) {
            query.placeTag = { $in: placeTagIds };
        }
        if (peopleTagIds.length > 0) {
            query.peopleTag = { $in: peopleTagIds };
        }

        const checkins = await Checkin.find(query)
            .populate('activityTag')
            .populate('peopleTag')
            .populate('placeTag')
            .populate('emotion')

        res.status(200).json({ checkins });
    } catch (err) {
        console.error("Error in /get-checkins-by-tags:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports=router