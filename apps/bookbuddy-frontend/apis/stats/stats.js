// Stats API calls

const getStats = async (userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/stats/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getStats:', error);
        throw error;
    }
};

const updateStreak = async (userToken, { pagesRead, minutesRead }) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/stats/update-streak`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ pagesRead, minutesRead }),
        });
        if (!response.ok) {
            throw new Error('Failed to update streak');
        }
        return response.json();
    } catch (error) {
        console.error('Error with updateStreak:', error);
        throw error;
    }
};

const getHistory = async (userToken, period = 'month') => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/stats/history?period=${period}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getHistory:', error);
        throw error;
    }
};

module.exports = {
    getStats,
    updateStreak,
    getHistory
};
