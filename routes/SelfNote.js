const express=require('express')
const router=express.Router()
const userAuth=require('../middleware/userAuth')
const User = require('../models/user');
const selfNote = require('../models/selfNote');

router.post('/new', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, note } = req.body;

        // Create new selfNote
        const newNote = new selfNote({ title, note });
        await newNote.save();

        // Add the note ID to the user's selfNotes array
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { selfNotes: newNote._id } },
            { new: true }
        ).populate('selfNotes');  // Make sure this matches schema

        res.status(200).json({
            message: "Successfully created new check-in note",
            data: updatedUser,
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

        // 2. Remove reference from User.selfNotes
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { selfNotes: noteId } },
            { new: true }
        ).populate('selfNotes');

        res.status(200).json({
            message: "Deleted check-in successfully",
            data: {
                deletedNote,
                updatedUser
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

        // Optional: Validate if the note belongs to the user
        const user = await User.findById(userId);
        if (!user.selfNotes.includes(noteId)) {
            return res.status(403).json({ message: "You do not have permission to edit this note" });
        }

        // Update the note
        const updatedNote = await selfNote.findByIdAndUpdate(
            noteId,
            { title, note },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note updated successfully", data: updatedNote });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error in Updating Note" });
    }
});



module.exports=router