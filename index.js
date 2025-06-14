const express = require('express');
const app = express();
const cookieParser=require('cookie-parser')
const {connectDb}=require("./utils/database")

app.use(express.json());
app.use(cookieParser())
require('dotenv').config();

const User = require('./models/user');
const mongoose = require("mongoose");

const Joi = require('joi');

const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.MONGO_URI);

app.get('/',(req,res)=>{
    res.send('Welcome to the server!');
})

const signupSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).required(),
    lastName: Joi.string().min(2).max(30).optional().allow(''),
    photoURL: Joi.string().uri().optional().allow(''),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

app.post('/signup', async (req, res) => {
    const { error } = signupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { firstName, lastName, photoURL, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            firstName: firstName,
            lastName: lastName || null,
            photoURL: photoURL || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png",
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


connectDb().then(()=>{
    console.log("connected to database")
    app.listen(8000,()=>console.log("Server is running on port 8000"))
}).catch(()=>{
    console.log("Error while connecting to database")
})


