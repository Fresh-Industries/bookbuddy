const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

// Highlights API calls

const getHighlights = async (userToken, bookId) => {
    try {
        const url = bookId 
            ? `${getApiBaseUrl()}/v1/highlights/book/${bookId}`
            : `${getApiBaseUrl()}/v1/highlights`;
            
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch highlights');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getHighlights:', error);
        throw error;
    }
};

const createHighlight = async (userToken, { userBookId, content, pageNumber, chapter, color, note }) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/highlights`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ userBookId, content, pageNumber, chapter, color, note }),
        });
        if (!response.ok) {
            throw new Error('Failed to create highlight');
        }
        return response.json();
    } catch (error) {
        console.error('Error with createHighlight:', error);
        throw error;
    }
};

const updateHighlight = async (userToken, id, { color, note }) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/highlights/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ color, note }),
        });
        if (!response.ok) {
            throw new Error('Failed to update highlight');
        }
        return response.json();
    } catch (error) {
        console.error('Error with updateHighlight:', error);
        throw error;
    }
};

const deleteHighlight = async (userToken, id) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/highlights/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete highlight');
        }
        return response.json();
    } catch (error) {
        console.error('Error with deleteHighlight:', error);
        throw error;
    }
};

module.exports = {
    getHighlights,
    createHighlight,
    updateHighlight,
    deleteHighlight
};
