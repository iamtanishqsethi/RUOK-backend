const express = require('express');
const app = express();
const cookieParser=require('cookie-parser')
const {connectDb}=require("./utils/database")
const AuthRouter=require('./routes/Auth.js')
const EmotionRouter=require('./routes/Emotion.js')

app.use(express.json());
app.use(cookieParser())
require('dotenv').config();



app.use('/api/auth',AuthRouter)
app.use('/api/emotion',EmotionRouter)



connectDb().then(()=>{
    console.log("connected to database")
    app.listen(8000,()=>console.log("Server is running on port 8000"))
}).catch(()=>{
    console.log("Error while connecting to database")
})


