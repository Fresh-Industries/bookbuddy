const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

// Preferences & Recommendations API calls

const getPreferences = async (userToken) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/preferences/preferences`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch preferences');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getPreferences:', error);
        throw error;
    }
};

const updatePreferences = async (userToken, { favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed }) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/preferences/preferences`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ favoriteGenres, favoriteAuthors, dislikeGenres, readingSpeed }),
        });
        if (!response.ok) {
            throw new Error('Failed to update preferences');
        }
        return response.json();
    } catch (error) {
        console.error('Error with updatePreferences:', error);
        throw error;
    }
};

const getRecommendations = async (userToken) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/preferences/recommendations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getRecommendations:', error);
        throw error;
    }
};

const updateReadingSpeed = async (userToken, { pagesRead, minutesSpent }) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/preferences/update-speed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ pagesRead, minutesSpent }),
        });
        if (!response.ok) {
            throw new Error('Failed to update reading speed');
        }
        return response.json();
    } catch (error) {
        console.error('Error with updateReadingSpeed:', error);
        throw error;
    }
};

module.exports = {
    getPreferences,
    updatePreferences,
    getRecommendations,
    updateReadingSpeed
};
