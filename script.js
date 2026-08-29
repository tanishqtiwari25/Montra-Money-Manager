// ===============================
// CONFIGURATION (API Base URL)
// ===============================
const API_BASE_URL = "https://montra-apis-w8pd.onrender.com";

const DEFAULT_TENANT_SLUG = "default";
const DEFAULT_ROLE = "User";

// ===============================
// TAB SWITCHING LOGIC
// ===============================
function switchTab(tab) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const loginBtn = document.getElementById("loginTabBtn");
    const signupBtn = document.getElementById("signupTabBtn");
    const indicator = document.getElementById("tabIndicator");

    if (tab === "signup") {
        loginForm.classList.remove("active");
        signupForm.classList.add("active");
        loginBtn.classList.remove("active");
        signupBtn.classList.add("active");
        if (indicator) indicator.style.transform = "translateX(100%)";
    } else {
        signupForm.classList.remove("active");
        loginForm.classList.add("active");
        signupBtn.classList.remove("active");
        loginBtn.classList.add("active");
        if (indicator) indicator.style.transform = "translateX(0%)";
    }
}

// ===============================
// BUTTON LOADING LOGIC
// ===============================
function setLoading(button, loading, originalText) {
    if (!button) return;
    if (loading) {
        button.disabled = true;
        button.innerText = "Connecting...";
    } else {
        button.disabled = false;
        button.innerText = originalText;
    }
}

// Helper to handle API Calls cleanly
async function makeApiCall(endpoint, payload) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let data = {};

    try {
        data = responseText ? JSON.parse(responseText) : {};
    } catch {
        data = { message: responseText };
    }

    return { ok: response.ok, status: response.status, data };
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", function () {

    const loginTabBtn = document.getElementById("loginTabBtn");
    const signupTabBtn = document.getElementById("signupTabBtn");

    if (loginTabBtn) loginTabBtn.addEventListener("click", () => switchTab("login"));
    if (signupTabBtn) signupTabBtn.addEventListener("click", () => switchTab("signup"));

    // -------------------------------
    // 1. LOGIN FORM HANDLING
    // -------------------------------
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const usernameOrEmail = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            if (!usernameOrEmail || !password) {
                alert("Please enter both Username/Email and Password.");
                return;
            }

            setLoading(submitBtn, true, "LOG IN");

            // Exact Login Schema Match
            const loginPayload = {
                tenantSlug: DEFAULT_TENANT_SLUG,
                usernameOrEmail: usernameOrEmail,
                password: password
            };

            try {
                // Testing primary capital path first, fallback if path case mismatch occurs
                let result = await makeApiCall("/api/Auth/login", loginPayload);
                
                if (result.status === 405 || result.status === 404) {
                    result = await makeApiCall("/api/auth/login", loginPayload);
                }

                if (result.ok) {
                    alert("Login Successful!");
                    const token = result.data.token || result.data.accessToken || result.data.access_token;
                    if (token) {
                        localStorage.setItem("authToken", token);
                    }
                } else {
                    alert(result.data.message || result.data.error || `Login Failed (Status: ${result.status})`);
                }

            } catch (error) {
                console.error("LOGIN NETWORK ERROR:", error);
                alert("Server connection error. Please try again.");
            } finally {
                setLoading(submitBtn, false, "LOG IN");
            }
        });
    }

    // -------------------------------
    // 2. SIGNUP FORM HANDLING
    // -------------------------------
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const fullName = document.getElementById("signup-name").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;

            if (!fullName || !email || !password) {
                alert("Please fill all required fields.");
                return;
            }

            const username = fullName.toLowerCase().replace(/[^a-z0-9]/g, "");

            setLoading(submitBtn, true, "CREATE ACCOUNT");

            // Exact Signup Schema Match
            const signupPayload = {
                tenantSlug: DEFAULT_TENANT_SLUG,
                email: email,
                username: username,
                password: password,
                role: DEFAULT_ROLE
            };

            try {
                // Testing primary capital path first, fallback to lower case if route throws 405
                let result = await makeApiCall("/api/Auth/register", signupPayload);

                if (result.status === 405 || result.status === 404) {
                    result = await makeApiCall("/api/auth/register", signupPayload);
                }

                if (result.ok || result.status === 201) {
                    alert("Account Created Successfully! Please Login.");
                    switchTab("login");
                    const loginEmail = document.getElementById("login-email");
                    if (loginEmail) loginEmail.value = email;
                } else {
                    alert(result.data.message || result.data.error || `Signup Failed (Status: ${result.status})`);
                }

            } catch (error) {
                console.error("SIGNUP NETWORK ERROR:", error);
                alert("Server connection error. Please try again.");
            } finally {
                setLoading(submitBtn, false, "CREATE ACCOUNT");
            }
        });
    }
});