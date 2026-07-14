
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // 1. Retrieve the token from localStorage
    const token = localStorage.getItem('rankquest_token');

    const headers = {
        'Content-Type': 'application/json',
        // 2. If token exists, attach it to the Authorization header
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || 'An error occurred');
        }

        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// --- Authentication Endpoints ---
export const signupUser = (userData) => {
    return request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const loginUser = (credentials) => {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

// --- User Profile Endpoints (NEW) ---

export const getUserProfile = () => {
    // Helper: Get email from local storage to identify user on backend
    // (Temporary solution until full JWT extraction is implemented on backend)
    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    return request(`/users/profile-by-email?email=${email}`, {
        method: 'GET',
    });
};

export const updateUserProfile = (data) => {
    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    return request(`/users/profile?email=${email}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const getSolvedProblems = () => {
    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    return request(`/submissions/my-solved?email=${email}`, {
        method: 'GET',
    });
};
// --- Problem Endpoints ---
export const getAllProblems = () => {
    return request('/problems', {
        method: 'GET',
    });
};

export const getProblemById = (id) => {
    return request(`/problems/${id}`, {
        method: 'GET',
    });
};


// --- Submission Endpoints ---
export const submitSolution = (problemId, submissionData) => {
    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    return request(`/submissions/${problemId}?email=${email}`, {
        method: 'POST',
        body: JSON.stringify(submissionData),
    });
};

// --- Ranking Endpoints ---

export const getGlobalRankings = () => {
    return request('/rankings/global', {
        method: 'GET',
    });
};

export const getCollegeRankings = (collegeName) => {
    // Encode the college name to handle spaces (e.g., "IIT Delhi" -> "IIT%20Delhi")
    const encodedCollege = encodeURIComponent(collegeName);
    return request(`/rankings/college?college=${encodedCollege}`, {
        method: 'GET',
    });
};
