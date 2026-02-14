const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

const getUser = async (userToken) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/users/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();


    }catch (error) {
        console.error('Error with searchBooks API call:', error);
        throw error;
    }
}

const getUserBookById = async (userToken, id) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/users/user-book/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();

    }catch (error) {
        console.error('Error with getUserBookById call:', error);
        throw error;
    }
}

const getUserNotes = async (userToken) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/users/user-notes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();

    }catch (error) {
        console.error('Error with getUserBookById call:', error);
        throw error;
    }
}

const getUserNotesByBookId = async (userToken, id) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/users/user-note/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            },
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();

    }catch (error) {
        console.error('Error with getUserBookById call:', error);
        throw error;
    }
}



module.exports = {
    getUser,
    getUserBookById,
    getUserNotes,
    getUserNotesByBookId

};
