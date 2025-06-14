const express = require('express');
const app = express();
const cookieParser=require('cookie-parser')
const {connectDb}=require("./utils/database")

app.use(express.json());
app.use(cookieParser())
require('dotenv').config();

app.get('/',(req,res)=>{
    res.send('Welcome to the server!');
})


connectDb().then(()=>{
    console.log("connected to database")
    app.listen(8000,()=>console.log("Server is running on port 8000"))
}).catch(()=>{
    console.log("Error while connecting to database")
})


