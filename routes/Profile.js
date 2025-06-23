const express=require('express')
const router=express.Router()
const userAuth=require('../middleware/userAuth')
const User=require('../models/user')
const {editProfileValidation}=require('../utils/validations')


router.get('/get', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .select('-password')
            .populate('selfNotes');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "fetched", data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error" });
    }
});


router.patch('/edit', userAuth, async (req, res) => {
    try{
        if(!req.body||Object.keys(req.body).length===0){
            return res.status(400).json({ message: "Invalid Body" })
        }
        if(!editProfileValidation(req)){
            return res.status(400).json({message:'Invalid Edit Fields'})
        }

        const user=req.user
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const updatedUser=await User.findByIdAndUpdate(user._id, req.body,{new: true})

        res.status(200).json({message:"Updated User Profile",data:updatedUser})

    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" });
    }
})
  
module.exports = router;