const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config(); 


const searchBooks = async (req, res) => {
    try {
        const { query } = req.query; 
        const response = await axios.get(`${process.env.GOOGLE_BOOKS_API_URL}?q=${query}&key=${process.env.GOOGLE_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).send('Error fetching book data');
    }
};

const getBook = async (req, res) => {
    try {
        const { id } = req.params; 


        const response = await axios.get(`${process.env.GOOGLE_BOOKS_API_URL}/${id}?key=${process.env.GOOGLE_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        res.status(500).send('Error fetching book data');
    }
}

const addBookToLibrary = async (req, res) => {
    try {
        console.log("addBookToLibrary called");
        const userId = req.UserId; 
        const { googleBooksId, imageUrl, title, authors, categories, pageCount } = req.body;

       
        if (!googleBooksId || !title || !authors) {
            return res.status(400).json({ message: "Missing required book information" });
        }

        console.log("userId", userId);
        console.log("googleBooksId", googleBooksId);
        // Prevent duplicate entries
        const existingBook = await prisma.userBook.findUnique({
            where: {
                userId_googleBooksId: {
                    userId: userId,
                    googleBooksId: googleBooksId,
                },
            },
        });

        if (existingBook) {
            return res.status(409).json({ message: "Book already in library" });
        }

        const book = await prisma.userBook.create({
            data: {
                userId: userId,
                googleBooksId: googleBooksId,
                imageUrl: imageUrl,
                title: title,
                authors: { set: authors }, // Use 'set' for array types
                categories: { set: categories },
                pageCount: pageCount,
            },
        });



        res.json(book);
    } catch (error) {
        console.error('Error adding book to library:', error);
        res.status(500).send('Error adding book to library');
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you pass the UserBook ID as a URL parameter
        const { status, rating, startedAt, finishedAt, pagesRead } = req.body;

        console.log("updateBook called");
        console.log("id", id);

        // Fetch the book to ensure it belongs to the user
        const existingBook = await prisma.userBook.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingBook || existingBook.userId !== req.UserId) {
            return res.status(404).json({ message: "Book not found in your library" });
        }

        // Update the book
        const updatedBook = await prisma.userBook.update({
            where: { id: parseInt(id) },
            data: { status, rating, startedAt, finishedAt, pagesRead },
        });

        console.log("updatedBook", updatedBook);

        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).send('Error updating book');
    }
};

const getUserBooks = async (req, res) => {
    try {
        
        const userId = req.UserId; // Set by your auth middleware
        console.log("getUserBooks called");
        console.log("userId", userId);

        const books = await prisma.userBook.findMany({
            where: { userId: userId },
        });

        res.json(books);
    } catch (error) {
        console.error('Error fetching user books:', error);
        res.status(500).send('Error fetching user books');
    }
};


module.exports = {
    searchBooks,
    getBook,
    addBookToLibrary,
    updateBook,
    getUserBooks,
};