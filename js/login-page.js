/**
 * StockWise - login Page JavaScript
 * Handles all functionality for the login page
 */
/**
         * Login Page JavaScript
         * Handles user authentication, form validation, and UI interactions
         */

// ===== GLOBAL VARIABLES =====
let isLoggingIn = false;

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    checkExistingLogin();

    // Setup event listeners
    setupEventListeners();

    // Setup form validation
    setupFormValidation();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', togglePasswordVisibility);

    // Quick login buttons
    const quickLoginBtns = document.querySelectorAll('.quick-login');
    quickLoginBtns.forEach(btn => {
        btn.addEventListener('click', handleQuickLogin);
    });

    // Enter key on password field
    const passwordField = document.getElementById('password');
    passwordField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const form = document.getElementById('loginForm');
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();

    if (!value) {
        showFieldError(field, `${field.name} is required`);
        return false;
    }

    // Additional validation based on field type
    if (field.name === 'username' && value.length < 3) {
        showFieldError(field, 'Username must be at least 3 characters');
        return false;
    }

    if (field.name === 'password' && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    }

    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback') ||
        field.nextElementSibling;
    if (feedback) {
        feedback.textContent = message;
    }
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
}

// ===== AUTHENTICATION FUNCTIONS =====
function checkExistingLogin() {
    // Use AuthManager for unified auth check
    if (typeof AuthManager !== 'undefined' && AuthManager.isAuthenticated()) {
        const user = AuthManager.getCurrentUser();
        showAlert(`You are already logged in as ${user.username}. Redirecting...`, 'info');

        setTimeout(() => {
            AuthManager.handlePostLoginRedirect();
        }, 2000);
    }
}

function handleLogin(event) {
    event.preventDefault();

    if (isLoggingIn) return;

    const formData = new FormData(event.target);
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();
    const rememberMe = formData.get('rememberMe') === 'on';

    // Validate form
    if (!validateLoginForm(username, password)) {
        return;
    }

    // Show loading state
    setLoadingState(true);

    // Simulate API call delay
    // Simulate API call delay
    authenticateUser(username, password, rememberMe);
}

function handleQuickLogin(event) {
    const btn = event.target.closest('.quick-login');
    const username = btn.dataset.username;
    const password = btn.dataset.password;

    // Fill form fields
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;

    // Submit form
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

function validateLoginForm(username, password) {
    let isValid = true;

    // Clear previous errors
    clearAllFieldErrors();

    // Validate username
    if (!username) {
        showFieldError(document.getElementById('username'), 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showFieldError(document.getElementById('username'), 'Username must be at least 3 characters');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showFieldError(document.getElementById('password'), 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError(document.getElementById('password'), 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

function authenticateUser(username, password, rememberMe) {
    // Use the new client-side database for authentication
    // Find user in DB directly
    const user = StockWiseDB.db.findOne('users', { username: username, status: 'active' });

    if (user && StockWiseDB.db.verifyPassword(password, user.password)) {
        // Update last login
        StockWiseDB.db.update('users', user.id, { last_login: new Date().toISOString() });

        // CRITICAL: Use AuthManager for unified session management
        if (typeof AuthManager !== 'undefined') {
            AuthManager.createSession(user, rememberMe);
        } else {
            console.error('AuthManager not loaded!');
            // Fallback should not happen if AuthManager is loaded correctly
            return;
        }

        // Show success message
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showToast('Login successful! Redirecting...', 'success', 2000);
        } else {
            showAlert('Login successful! Redirecting to dashboard...', 'success');
        }

        // Redirect using AuthManager
        // Redirect using AuthManager
        if (typeof AuthManager !== 'undefined') {
            AuthManager.handlePostLoginRedirect();
        } else {
            redirectToDashboard(user.role);
        }

    } else {
        // Show error message
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showToast('Invalid username or password', 'error', 3000);
        } else {
            showAlert('Invalid username or password. Please try again.', 'danger');
        }
        setLoadingState(false);

        // Focus on username field
        document.getElementById('username').focus();
    }
}

// ===== UTILITY FUNCTIONS =====
function redirectToDashboard(role) {
    switch (role) {
        case 'admin':
            window.location.href = 'admin-dashboard.html';
            break;
        case 'user':
        case 'staff':
        default:
            window.location.href = 'user-dashboard.html';
            break;
    }
}

function setLoadingState(loading) {
    isLoggingIn = loading;
    const submitBtn = document.querySelector('button[type="submit"]');
    const btnText = document.getElementById('loginBtnText');
    const spinner = document.getElementById('loginSpinner');

    if (loading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Logging in...';
        spinner.classList.remove('d-none');
    } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Login';
        spinner.classList.add('d-none');
    }
}

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const icon = toggleBtn.querySelector('i');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        toggleBtn.title = 'Hide Password';
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        toggleBtn.title = 'Show Password';
    }
}

function clearAllFieldErrors() {
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => {
        field.classList.remove('is-invalid');
    });
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
                <i class="fas fa-${getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

    // Clear existing alerts
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function logActivity(action, userData) {
    const activityLog = {
        action: action,
        username: userData.username,
        role: userData.role,
        timestamp: new Date().toISOString(),
        ip: 'demo-ip',
        userAgent: navigator.userAgent
    };

    // Store activity log
    const logs = JSON.parse(localStorage.getItem('stockwise_activity_logs') || '[]');
    logs.push(activityLog);

    // Keep only last 100 logs
    if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
    }

    localStorage.setItem('stockwise_activity_logs', JSON.stringify(logs));
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function (e) {
    // Alt + L for quick admin login
    if (e.altKey && e.key === 'l') {
        e.preventDefault();
        document.querySelector('[data-username="admin"]').click();
    }
});


