const express = require('express');
const app = express();
const cookieParser=require('cookie-parser')
const {connectDb}=require("./utils/database")
const cors=require("cors")
const AuthRouter=require('./routes/Auth.js')
const EmotionRouter=require('./routes/Emotion.js')
const PlaceTagRouter=require('./routes/PlaceTag.js')
const ActivityTagRouter=require('./routes/ActivityTag.js')
const PeopleTagRouter=require('./routes/PeopleTag.js')
const CheckinRouter=require('./routes/CheckIn.js')
const ProfileRouter=require('./routes/Profile.js')

app.use(cors({
    origin:['http://localhost:5173'],
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser())
require('dotenv').config();

app.use('/api/auth',AuthRouter)
app.use('/api/emotion',EmotionRouter)
app.use('/api/checkin',CheckinRouter)
app.use('/api/placeTag',PlaceTagRouter)
app.use('/api/activityTag',ActivityTagRouter)
app.use('/api/peopleTag',PeopleTagRouter)
app.use('/api/profile',ProfileRouter)


connectDb().then(()=>{
    console.log("connected to database")
    app.listen(8000,()=>console.log("Server is running on port 8000"))
}).catch(()=>{
    console.log("Error while connecting to database")
})


