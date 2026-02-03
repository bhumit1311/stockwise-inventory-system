/**
 * StockWise - register Page JavaScript
 * Handles all functionality for the register page
 */
/**
         * Register Page JavaScript
         * Handles user registration, form validation, and UI interactions
         */

// ===== GLOBAL VARIABLES =====
let isRegistering = false;

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
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', handleRegister);

    // Password toggle buttons
    const togglePassword = document.getElementById('togglePassword');
    togglePassword.addEventListener('click', () => togglePasswordVisibility('password', 'togglePassword'));

    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword'));

    // Real-time validation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Username availability check
    const usernameField = document.getElementById('username');
    usernameField.addEventListener('blur', checkUsernameAvailability);

    // Email availability check
    const emailField = document.getElementById('email');
    emailField.addEventListener('blur', checkEmailAvailability);

    // Password confirmation check
    const confirmPasswordField = document.getElementById('confirmPassword');
    confirmPasswordField.addEventListener('input', checkPasswordMatch);
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (validateForm()) {
            handleRegister(event);
        }
    });
}

function validateForm() {
    const form = document.getElementById('registerForm');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.required && !value) {
        showFieldError(field, `${getFieldLabel(fieldName)} is required`);
        return false;
    }

    // Specific field validations
    switch (fieldName) {
        case 'fullName':
            if (value.length < 2) {
                showFieldError(field, 'Full name must be at least 2 characters');
                return false;
            }
            break;

        case 'username':
            if (value.length < 3) {
                showFieldError(field, 'Username must be at least 3 characters');
                return false;
            }
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                showFieldError(field, 'Username can only contain letters, numbers, and underscores');
                return false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;

        case 'password':
            if (value.length < 6) {
                showFieldError(field, 'Password must be at least 6 characters');
                return false;
            }
            // Check password confirmation if it exists
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword.value && confirmPassword.value !== value) {
                showFieldError(confirmPassword, 'Passwords do not match');
            }
            break;

        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                showFieldError(field, 'Passwords do not match');
                return false;
            }
            break;

        case 'role':
            if (!value) {
                showFieldError(field, 'Please select an account type');
                return false;
            }
            break;

        case 'agreeTerms':
            if (!field.checked) {
                showFieldError(field, 'You must agree to the terms and conditions');
                return false;
            }
            break;
    }

    return true;
}

function checkUsernameAvailability() {
    const username = document.getElementById('username').value.trim();
    if (username.length < 3) return;

    const existingUser = StockWiseDB.db.findOne('users', { username: username });
    if (existingUser) {
        showFieldError(document.getElementById('username'), 'Username is already taken');
    }
}

function checkEmailAvailability() {
    const email = document.getElementById('email').value.trim();
    if (!email) return;

    const existingUser = StockWiseDB.db.findOne('users', { email: email });
    if (existingUser) {
        showFieldError(document.getElementById('email'), 'Email is already registered');
    }
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (confirmPassword && password !== confirmPassword) {
        showFieldError(document.getElementById('confirmPassword'), 'Passwords do not match');
    } else if (confirmPassword && password === confirmPassword) {
        clearFieldError(document.getElementById('confirmPassword'));
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback') ||
        field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    field.classList.remove('is-invalid');
}

function getFieldLabel(fieldName) {
    const labels = {
        'fullName': 'Full name',
        'username': 'Username',
        'email': 'Email',
        'password': 'Password',
        'confirmPassword': 'Password confirmation',
        'role': 'Account type',
        'agreeTerms': 'Terms agreement'
    };
    return labels[fieldName] || fieldName;
}

// ===== REGISTRATION FUNCTIONS =====
function checkExistingLogin() {
    const userData = typeof AuthManager !== 'undefined' ? AuthManager.getCurrentUser() : null;
    if (userData) {
        showAlert(`You are already logged in as ${userData.username}. Redirecting...`, 'info');

        setTimeout(() => {
            if (userData.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }, 2000);
    }
}

function handleRegister(event) {
    event.preventDefault();

    if (isRegistering) return;

    const formData = new FormData(event.target);
    const userData = {
        fullName: formData.get('fullName').trim(),
        username: formData.get('username').trim(),
        email: formData.get('email').trim(),
        password: formData.get('password'),
        role: formData.get('role'),
        agreeTerms: formData.get('agreeTerms') === 'on'
    };

    // Final validation
    if (!validateRegistrationData(userData)) {
        return;
    }

    // Show loading state
    setLoadingState(true);

    // Simulate API call delay
    setTimeout(() => {
        registerUser(userData);
    }, 1000);
}

function validateRegistrationData(userData) {
    // Check if username already exists
    const existingUsername = StockWiseDB.db.findOne('users', { username: userData.username });
    if (existingUsername) {
        showAlert('Username is already taken. Please choose a different one.', 'danger');
        setLoadingState(false);
        return false;
    }

    // Check if email already exists
    const existingEmail = StockWiseDB.db.findOne('users', { email: userData.email });
    if (existingEmail) {
        showAlert('Email is already registered. Please use a different email or login.', 'danger');
        setLoadingState(false);
        return false;
    }

    return true;
}

function registerUser(userData) {
    try {
        // Create new user record
        const userId = StockWiseDB.db.insert('users', {
            username: userData.username,
            email: userData.email,
            password: StockWiseDB.db.hashPassword(userData.password),
            full_name: userData.fullName,
            role: userData.role,
            status: 'active'
        });

        // Show success message
        showAlert('Registration successful! You can now login with your credentials.', 'success');

        // Clear form
        document.getElementById('registerForm').reset();

        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'danger');
        setLoadingState(false);
    }
}

// ===== UTILITY FUNCTIONS =====
function setLoadingState(loading) {
    isRegistering = loading;
    const submitBtn = document.querySelector('button[type="submit"]');
    const btnText = document.getElementById('registerBtnText');
    const spinner = document.getElementById('registerSpinner');

    if (loading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Creating Account...';
        spinner.classList.remove('d-none');
    } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Create Account';
        spinner.classList.add('d-none');
    }
}

function togglePasswordVisibility(fieldId, buttonId) {
    const passwordField = document.getElementById(fieldId);
    const toggleBtn = document.getElementById(buttonId);
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


