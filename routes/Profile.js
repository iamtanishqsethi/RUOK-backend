const express=require('express')
const router=express.Router()
const userAuth=require('../middleware/userAuth')
const User=require('../models/user')


router.get('/get', userAuth, async (req, res) => {
    try {
        const userId=req.user._id
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "fetched", data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "error" });
        }
  });
  
  module.exports = router;