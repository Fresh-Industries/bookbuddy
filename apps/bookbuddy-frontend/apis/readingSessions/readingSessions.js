const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

const createReadingSession = async (token,data) => {
    try {
        const response = await fetch(`${getApiBaseUrl()}/v1/reading-sessions/new-reading-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          return response.json();
        } catch (error) {
          console.error('Error with reading session API call:', error);
          throw error;
    }
};

module.exports = {
    createReadingSession,
};
