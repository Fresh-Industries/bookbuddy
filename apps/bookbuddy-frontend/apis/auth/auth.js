const { getApiBaseUrl } = require('../../utils/apiBaseUrl');

// JWT auth API calls

const signup = async (data) => {
    const API_BASE_URL = getApiBaseUrl();
    const signupUrl = `${API_BASE_URL}/v1/auth/signup`;
    try {
        const response = await fetch(signupUrl, {
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
            throw new Error(error.message || 'Signup failed');
        }
      
        const payload = await response.json();
        return { token: payload.token };
    } catch (error) {
        console.error('Error with signup API call:', { url: signupUrl, error });
        throw error;
    }
};

const login = async (data) => {
    const API_BASE_URL = getApiBaseUrl();
    const loginUrl = `${API_BASE_URL}/v1/auth/login`;
    try {
        const response = await fetch(loginUrl, {
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
      
        const payload = await response.json();
        return { token: payload.token };
    } catch (error) {
        console.error('Error with login API call:', { url: loginUrl, error });
        throw error;
    }
};

const logout = async (userToken) => {
    const API_BASE_URL = getApiBaseUrl();
    try {
        const response = await fetch(`${API_BASE_URL}/api/signOut`, {
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
    const API_BASE_URL = getApiBaseUrl();
    try {
        const response = await fetch(`${API_BASE_URL}/api/session`, {
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
