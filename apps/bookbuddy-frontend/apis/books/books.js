const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

const getErrorMessage = async (response, fallback) => {
    const bodyText = await response.text();
    return `${fallback} (${response.status})${bodyText ? `: ${bodyText}` : ''}`;
};

const searchBooks = async (query) => {
    try {
        const normalizedQuery = `${query ?? ''}`.trim();
        if (!normalizedQuery) {
            return { items: [] };
        }

        const response = await fetch(`${getApiBaseUrl()}/v1/books/search-books?query=${encodeURIComponent(normalizedQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Book search failed'));
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
        const response = await fetch(`${getApiBaseUrl()}/v1/books/books/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        })
        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Failed to fetch book'));
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
        const response = await fetch(`${getApiBaseUrl()}/v1/books/add-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(bookDetails),
        });
        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Failed to add book'));
        }
        return response.json();
    } catch (error) {
        console.error('Error with addBookToLibrary API call:', error);
        throw error;
    }
};

const getUserBooks = async (userToken) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/books/getUserBooks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`, // Ensure the request includes the JWT token
            },
        });
        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Failed to fetch user books'));
        }
        return response.json();
    } catch (error) {
        console.error('Error with getUserBooks API call:', error);
        throw error;
    }
};

const updateUserBook = async (userToken, id, data) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/books/updateBook/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error(await getErrorMessage(response, 'Failed to update book'));
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
