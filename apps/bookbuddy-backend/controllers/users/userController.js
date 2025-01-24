const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config(); 

const getUserById = async (req, res) => {
    try {
        const userId = req.UserId;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });
        console.log("user", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Error fetching user data');
    }
};

const getUserBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const userBook = await prisma.userBook.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        console.log("userBook", userBook);
        if (!userBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(userBook);
    } catch (error) {
        console.error('Error fetching user book data:', error);
        res.status(500).send('Error fetching user book data');
    }
};

const getUserNotes = async (req, res) => {
    try {
        const userId = req.UserId;
        const userNotes = await prisma.note.findMany({
            where: {
                userId,
            },
        });
        console.log("userNotes", userNotes);
        res.json(userNotes);
    } catch (error) {
        console.error('Error fetching user notes:', error);
        res.status(500).send('Error fetching user notes');
    }
};

const getUserNoteByBookId = async (req, res) => {
    try {
        const userId = req.UserId;
        const { id } = req.params;
        const userNote = await prisma.note.findMany({
            where: {
                userId,
                userBookId: parseInt(id)
            },
        });
        console.log("userNote", userNote);
        res.json(userNote);
    } catch (error) {
        console.error('Error fetching user note:', error);
        res.status(500).send('Error fetching user note');
    }
};

module.exports = {
    getUserById,
    getUserBookById,
    getUserNotes,
    getUserNoteByBookId
};

