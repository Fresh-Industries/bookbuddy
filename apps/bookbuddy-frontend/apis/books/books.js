const searchBooks = async (query) => {
    try {
        const response = await fetch(`h${process.env.BASE_URL}/v1/books/search-books?query=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }
    catch (error) {
        console.error('Error with searchBooks API call:', error);
        throw error;
    }
}

const getBook = async (id) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/books/books/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }
    catch (error) {
        console.error('Error with searchBooks API call:', error);
        throw error;
    }
}

const addBookToLibrary = async (bookDetails, userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/books/add-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(bookDetails),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error with addBookToLibrary API call:', error);
        throw error;
    }
};

const getUserBooks = async (userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/books/getUserBooks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`, // Ensure the request includes the JWT token
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getUserBooks API call:', error);
        throw error;
    }
};

const updateUserBook = async (userToken, id, data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/books/updateBook/${id} `, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        

    }catch (error) {
        console.error('Error with update user book call:', error);
        throw error;
    }
}






module.exports = {
    searchBooks,
    getBook,
    addBookToLibrary,
    updateUserBook,
    getUserBooks,

};
