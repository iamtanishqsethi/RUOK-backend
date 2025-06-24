const express=require('express')
const router=express.Router()
const userAuth=require('../middleware/userAuth')
const User = require('../models/user');
const selfNote = require('../models/selfNote');


router.get('/getAll',userAuth,async (req,res)=>{
    try{
        const userId=req.user._id
        const selfNotes=await selfNote.find({userId})
        res.status(200).json({message:"Fetched All notes",data:selfNotes})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.post('/new', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, note } = req.body;

        // Create new selfNote
        const newNote = new selfNote({ userId,title, note });
        await newNote.save();

        res.status(200).json({
            message: "Successfully created new check-in note",
            data: newNote,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.delete('/delete/:id', userAuth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user._id;

        // 1. Delete the selfNote from the collection
        const deletedNote = await selfNote.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Deleted check-in successfully",
            data: {
                deletedNote
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error in Deleting Check-in" });
    }
});


router.patch('/update/:id', userAuth, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user._id;
        const { title, note } = req.body;

        // First, find the note and check if it belongs to the current user
        const existingNote = await selfNote.findOne({ _id: noteId, userId });

        if (!existingNote) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        // Then update it
        const updatedNote = await selfNote.findByIdAndUpdate(
            noteId,
            { title, note },
            { new: true }
        );

        res.status(200).json({ message: "Note updated successfully", data: updatedNote });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error in Updating Note" });
    }
});




module.exports=router