const cron=require('node-cron');
const User=require('../models/user')
const mongoose=require('mongoose')


//if mongoose not connected, return
const isDatabaseConnected=()=>{
    return mongoose.connection.readyState === 1;
}

const deleteGuestUsers=async ()=>{
    try{
        if(!isDatabaseConnected()){
            console.error('Database not connected. Skipping guest user cleanup.');
            return;
        }

        const result=await User.deleteMany({isGuest:true})
        console.log(`Deleted ${result.deletedCount} guest users at ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`)
    }
    catch (err) {
        console.error('Error deleting guest users:', err);
    }
}


cron.schedule('30 9 * * *', deleteGuestUsers,{
    scheduled: true,
    timezone: 'Asia/Kolkata'
})