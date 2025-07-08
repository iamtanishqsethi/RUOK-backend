const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const {signupValidation,logInValidation}=require('../utils/validations.js')
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const userAuth = require("../middleware/userAuth");

router.post('/signup', async (req, res) => {
    //validating inputs from req.body
    const { error } = signupValidation.validate(req.body);
    if (error) {
        return res.status(411).json({ message: error.details[0].message });
    }
    const { firstName, email, password } = req.body;

    try {
        //finding existing user in db
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }

        const passwordHash=await bcrypt.hash(password,10)

        const newUser = new User({
            firstName: firstName,
            email: email,
            password: passwordHash
        });

        await newUser.save();

        //creating jwt token for the new user , expires  in 1 day
        const token =await jwt.sign({_id:newUser._id},process.env.JWT_KEY,{expiresIn:'1d'});

        res.cookie("token",token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path:'/',
            maxAge:3600000*24
        })

        const userObj = newUser.toObject();
        delete userObj.password;

        return res.status(201).json({ message: 'User created successfully', user: userObj });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


router.post('/login', async (req, res) => {

    //validating body
    const {error}=logInValidation.validate(req.body)
    if (error) {
        return res.status(411).json({ message: error.details[0].message });
    }

    const {email,password} = req.body
    try{
        //check if the user  exists
        const user=await User.findOne({ email: email })
        if(!user){
            return res.status(403).json({ message: 'Invalid Credentials' });
        }
        //validate password
        const isValidPassword=await bcrypt.compare(password,user.password)
        if(!isValidPassword){
            return res.status(403).json({ message: 'Invalid Credentials' })
        }

        //create jwt token
        const token=jwt.sign({_id:user._id},process.env.JWT_KEY,{expiresIn:'1d'});
        res.cookie("token",token,{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path:'/',
            maxAge:3600000*24
        })
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({message: 'User logged in successfully',user:userObj})

    }
    catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/guest-login',async (req,res)=>{
    try{
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const guestUser=new User({
            firstName:'Guest',
            lastName:'User',
            email: `${guestId}@guest.temp`,
            password: await bcrypt.hash(guestId, 10),
            bio: "Guest user account",
            isGuest: true
        })
        await guestUser.save();

        const token = jwt.sign(
            { _id: guestUser._id, isGuest: true },
            process.env.JWT_KEY,
            { expiresIn: '1h' } // Shorter expiration for guests
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 3600000 // 1 hour
        });

        const userObj = guestUser.toObject();
        delete userObj.password;

        res.status(200).json({
            message: 'Guest login successful',
            user: userObj,
            isGuest: true
        });
    }
    catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }

})

router.delete('/delete-guest',userAuth,async (req,res)=>{
    try{
       const userId=req.user._id
        const isValidUser=await User.findByIdAndDelete(userId)
        if(!isValidUser){
            return res.status(404).json({ message: 'Invalid Credentials' });
        }

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        })

        return res.status(200).json({message: 'User deleted successfully'})
    }
    catch(err){
        console.error("Error Deleting guest", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


router.post('/logout',async (req, res) => {
    res.cookie("token",null,{
        expires:new Date(Date.now())
    })
    res.send({message:'Logged out successfully'})
})

module.exports = router;