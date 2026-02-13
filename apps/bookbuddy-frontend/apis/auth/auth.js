// Better Auth API calls
// Backend uses Better Auth which has different endpoints than the old implementation

const signup = async (data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
                name: data.name || data.email.split('@')[0]
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }
      
        const session = await response.json();
        // Return in format frontend expects: { token: accessToken }
        return { token: session.session?.accessToken || session.accessToken };
    } catch (error) {
        console.error('Error with signup API call:', error);
        throw error;
    }
};

const login = async (data) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/signIn/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
      
        const session = await response.json();
        // Return in format frontend expects: { token: accessToken }
        return { token: session.session?.accessToken || session.accessToken };
    } catch (error) {
        console.error('Error with login API call:', error);
        throw error;
    }
};

const logout = async (userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/signOut`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Logout failed');
        }
      
        return response.json();
    } catch (error) {
        console.error('Error with logout API call:', error);
        throw error;
    }
};

const getSession = async (userToken) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/session`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`
            },
        });
        if (!response.ok) {
            throw new Error('No active session');
        }
      
        const session = await response.json();
        // Return user data in format frontend expects
        return { 
            user: session.session?.user || session.user,
            token: session.session?.accessToken || session.accessToken 
        };
    } catch (error) {
        console.error('Error with getSession API call:', error);
        throw error;
    }
};

module.exports = {
    signup,
    login,
    logout,
    getSession
};
