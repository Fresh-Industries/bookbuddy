const signup = async (data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          return response.json();
        } catch (error) {
          console.error('Error with signup API call:', error);
          throw error;
    }
};

const login = async (data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          return response.json();
        } catch (error) {
          console.error('Error with login API call:', error);
          throw error;
    }
};



module.exports = {
    signup,
    login
}