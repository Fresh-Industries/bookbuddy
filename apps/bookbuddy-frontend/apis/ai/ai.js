const chatbot = async (data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/ai/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: data }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          return await response.json();
        } catch (error) {
          console.error('Error with login API call:', error);
          throw error;
    }
};

const readingSessionChatbot = async (data, id) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/ai/readingSessionChatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${id}`
            },
            body: JSON.stringify({ message: data }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          return await response.json();
        } catch (error) {
          console.error('Error with login API call:', error);
          throw error;
    }
};

module.exports = {
    chatbot,
    readingSessionChatbot
}
