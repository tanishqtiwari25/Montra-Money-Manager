import CONFIG from './config.js';

// Generic Fetch Wrapper for Reusability
async function fetchAPI(endpoint, payload) {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'API Request Failed');
    }
    return data;
}

// 1. LOGIN API CALL
export async function loginUser(usernameOrEmail, password) {
    const payload = {
        tenantSlug: CONFIG.DEFAULT_TENANT_SLUG,
        usernameOrEmail: usernameOrEmail,
        password: password
    };

    return await fetchAPI('/api/auth/login', payload);
}

// 2. SIGNUP API CALL
export async function signupUser(fullName, email, password) {
    // Space remove karke clean username
    const username = fullName.toLowerCase().replace(/\s+/g, '');

    const payload = {
        tenantSlug: CONFIG.DEFAULT_TENANT_SLUG,
        email: email,
        username: username,
        password: password,
        role: CONFIG.DEFAULT_ROLE
    };

    return await fetchAPI('/api/auth/signup', payload);
}