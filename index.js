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
const SelfNoteRouter=require('./routes/SelfNote.js')

app.use(cors({
    origin:['http://localhost:5173','https://ru-ok.vercel.app'],
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
app.use('/api/selfNote',SelfNoteRouter)

// Database connection with better error handling
let isDbConnected = false;

const ensureDbConnection = async () => {
    if (!isDbConnected) {
        try {
            await connectDb();
            isDbConnected = true;
            console.log("Connected to database");
        } catch (error) {
            console.error("Database connection failed:", error);
            throw error;
        }
    }
};

// Connect to database on startup
ensureDbConnection().catch(error => {
    console.error("Initial database connection failed:", error);
})
app.use('/api', async (req, res, next) => {
    try {
        await ensureDbConnection();
        next();
    } catch (error) {
        console.error("Database connection middleware error:", error);
        res.status(500).json({
            error: 'Database connection failed',
            message: 'Internal server error'
        });
    }
});

module.exports=app;

if(require.main===module){
    app.listen(8000,()=>console.log("Server is running on port 8000"))
}


