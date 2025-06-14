const express=require('express');
const router=express.Router();
const User=require('../models/user.js');
const {signupValidation}=require('../utils/validations.js')

router.post('/signup', async (req, res) => {
    const { error } = signupValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { firstName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            firstName: firstName,
            email: email,
            password: password
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;