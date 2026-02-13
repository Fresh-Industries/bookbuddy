// Goals API calls

const getGoals = async (userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/goals`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch goals');
        }
        return response.json();
    } catch (error) {
        console.error('Error with getGoals:', error);
        throw error;
    }
};

const createGoal = async (userToken, { year, month, type, target }) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/goals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ year, month, type, target }),
        });
        if (!response.ok) {
            throw new Error('Failed to create goal');
        }
        return response.json();
    } catch (error) {
        console.error('Error with createGoal:', error);
        throw error;
    }
};

const updateGoalProgress = async (userToken, id, progress) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/goals/${id}/progress`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ progress }),
        });
        if (!response.ok) {
            throw new Error('Failed to update goal');
        }
        return response.json();
    } catch (error) {
        console.error('Error with updateGoalProgress:', error);
        throw error;
    }
};

const deleteGoal = async (userToken, id) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/goals/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete goal');
        }
        return response.json();
    } catch (error) {
        console.error('Error with deleteGoal:', error);
        throw error;
    }
};

module.exports = {
    getGoals,
    createGoal,
    updateGoalProgress,
    deleteGoal
};
