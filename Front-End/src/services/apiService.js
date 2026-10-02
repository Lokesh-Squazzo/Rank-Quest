
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

// Solved problems cache and in-flight deduplication
let solvedProblemsCache = null;
let lastSolvedFetchTime = 0;
let solvedFetchPromise = null;
const SOLVED_CACHE_TTL = 45 * 1000; // 45 seconds

export const invalidateSolvedProblemsCache = () => {
    solvedProblemsCache = null;
    lastSolvedFetchTime = 0;
    solvedFetchPromise = null;
};

export const getSolvedProblems = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && solvedProblemsCache && (now - lastSolvedFetchTime < SOLVED_CACHE_TTL)) {
        return solvedProblemsCache;
    }

    // Reuse in-flight promise if multiple components request at once
    if (solvedFetchPromise) {
        return solvedFetchPromise;
    }

    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    solvedFetchPromise = (async () => {
        try {
            const data = await request(`/submissions/my-solved?email=${email}`, {
                method: 'GET',
            });
            solvedProblemsCache = data;
            lastSolvedFetchTime = Date.now();
            return data;
        } finally {
            solvedFetchPromise = null;
        }
    })();

    return solvedFetchPromise;
};

// In-memory cache for problems to eliminate duplicate network delays across navigations
let problemsCache = null;
let lastProblemsFetchTime = 0;
const PROBLEMS_CACHE_TTL = 60 * 1000; // 60 seconds

// In-memory cache for individual problem details
const problemDetailCache = new Map();

export const invalidateProblemsCache = () => {
    problemsCache = null;
    lastProblemsFetchTime = 0;
    problemDetailCache.clear();
};

// --- Problem Endpoints ---
export const getAllProblems = async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && problemsCache && (now - lastProblemsFetchTime < PROBLEMS_CACHE_TTL)) {
        return problemsCache;
    }
    const data = await request('/problems', {
        method: 'GET',
    });
    problemsCache = data;
    lastProblemsFetchTime = now;
    return data;
};

export const getProblemById = async (id, forceRefresh = false) => {
    const cacheKey = String(id);
    if (!forceRefresh && problemDetailCache.has(cacheKey)) {
        return problemDetailCache.get(cacheKey);
    }
    const data = await request(`/problems/${id}`, {
        method: 'GET',
    });
    problemDetailCache.set(cacheKey, data);
    return data;
};

// --- Submission Endpoints ---
export const submitSolution = async (problemId, submissionData) => {
    const savedUser = localStorage.getItem('rankquest_user');
    const email = savedUser ? JSON.parse(savedUser).email : '';

    const result = await request(`/submissions/${problemId}?email=${email}`, {
        method: 'POST',
        body: JSON.stringify(submissionData),
    });

    // Invalidate solved problems cache so solved state updates immediately
    invalidateSolvedProblemsCache();
    return result;
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

// --- Admin Problem Endpoints ---
export const createAdminProblem = async (problemData) => {
    const res = await request('/admin/problems', {
        method: 'POST',
        body: JSON.stringify(problemData),
    });
    invalidateProblemsCache();
    return res;
};

export const updateAdminProblem = async (problemId, problemData) => {
    const res = await request(`/admin/problems/${problemId}`, {
        method: 'PUT',
        body: JSON.stringify(problemData),
    });
    invalidateProblemsCache();
    return res;
};

export const deleteAdminProblem = async (problemId) => {
    const res = await request(`/admin/problems/${problemId}`, {
        method: 'DELETE',
    });
    invalidateProblemsCache();
    return res;
};

