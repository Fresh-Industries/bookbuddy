import axios from 'axios';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import 'dotenv/config'; 

const GOOGLE_BOOKS_BASE_URL = process.env.GOOGLE_BOOKS_API_URL || 'https://www.googleapis.com/books/v1/volumes';

const hasUsableGoogleApiKey = () => {
    const key = process.env.GOOGLE_API_KEY?.trim();
    return !!key && key.toLowerCase() !== 'your-google-api-key';
};

const buildGoogleBooksUrl = ({ id, query }) => {
    const baseUrl = id ? `${GOOGLE_BOOKS_BASE_URL}/${encodeURIComponent(id)}` : GOOGLE_BOOKS_BASE_URL;
    const url = new URL(baseUrl);

    if (query) {
        url.searchParams.set('q', query);
    }

    if (hasUsableGoogleApiKey()) {
        url.searchParams.set('key', process.env.GOOGLE_API_KEY.trim());
    }

    return url.toString();
};

const sendGoogleBooksError = (error, res, fallbackMessage) => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const details = error.response?.data?.error?.message || error.response?.statusText || fallbackMessage;
        return res.status(status).json({ error: fallbackMessage, details });
    }

    return res.status(500).json({ error: fallbackMessage });
};

export const searchBooks = async (req, res) => {
    try {
        const { query } = req.query; 
        if (!query || !`${query}`.trim()) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await axios.get(buildGoogleBooksUrl({ query: `${query}`.trim() }));
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        return sendGoogleBooksError(error, res, 'Error fetching book data');
    }
};

export const getBook = async (req, res) => {
    try {
        const { id } = req.params; 
        if (!id) {
            return res.status(400).json({ error: 'Book id is required' });
        }

        const response = await axios.get(buildGoogleBooksUrl({ id }));
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Google Books API:', error);
        return sendGoogleBooksError(error, res, 'Error fetching book data');
    }
}

export const addBookToLibrary = async (req, res) => {
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

export const updateBook = async (req, res) => {
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

export const getUserBooks = async (req, res) => {
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


export default {
    searchBooks,
    getBook,
    addBookToLibrary,
    updateBook,
    getUserBooks,
};
