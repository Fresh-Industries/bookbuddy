const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function userBookById(bookId) {
    return await prisma.userBook.findUnique({
        where: {
            id: parseInt(bookId)
        }
    });
};

const createReadingSession = async (req, res) => {
    try {
        const { userBookId, startedAt, pageEnd, timeSpent, notesContent } = req.body;
        const userId = req.UserId;

        const userBook = await userBookById(userBookId);

        

        const readingSession = await prisma.readingSession.create({
            data: {
                userId,
                userBookId,
                startedAt,
                pageStart: userBook.pagesRead || 0,
                pageEnd,
                timeSpent
            },
        });

        console.log("readingSession", readingSession);

        
        if (readingSession && notesContent && notesContent.trim().length > 0) {
            await prisma.note.create({
                data: {
                    content: notesContent,
                    userId,
                    userBookId,
                    readingSessionId: readingSession.id,
                },
            });
        }
        
        res.json(readingSession);
    } catch (error) {
        console.error('Error creating reading session:', error);
        res.status(500).send('Error creating reading session');
    }
};

const getReadingSessions = async (req, res) => {
    try {
        const userId = req.UserId;

        const readingSessions = await prisma.readingSession.findMany({
            where: {
                userId,
            },
            include: {
                notes: true,
            },
        });

        res.json(readingSessions);
    } catch (error) {
        console.error('Error getting reading sessions:', error);
        res.status(500).send('Error getting reading sessions');
    }
};

module.exports = {
    createReadingSession,
};
