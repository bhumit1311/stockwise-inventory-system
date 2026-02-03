/**
 * StockWise - profile Page JavaScript
 * Handles all functionality for the profile page
 */
let currentUser = null;

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication using AuthManager
    currentUser = AuthManager.requireAuth(null, 'login.html');
    if (!currentUser) return;

    // Update navigation based on user role
    updateNavigation();

    // Load profile data
    loadProfileData();

    // Load activity log
    loadActivityLog();

    // Setup form handlers
    setupFormHandlers();

    // Logout listener
    document.getElementById('logoutBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        logout();
    });
});

function updateNavigation() {
    document.getElementById('currentUserName').textContent = currentUser.first_name + ' ' + currentUser.last_name;

    if (currentUser.role === 'admin') {
        document.getElementById('usersNavItem').style.display = 'block';
        document.getElementById('reportsNavItem').style.display = 'block';
    }
}

function goToDashboard() {
    if (currentUser.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'user-dashboard.html';
    }
}

function loadProfileData() {
    // Populate form fields
    document.getElementById('firstName').value = currentUser.first_name || '';
    document.getElementById('lastName').value = currentUser.last_name || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('department').value = currentUser.department || '';
    document.getElementById('position').value = currentUser.position || '';
    document.getElementById('address').value = currentUser.address || '';

    // Update profile summary
    document.getElementById('profileDisplayName').textContent =
        (currentUser.first_name || '') + ' ' + (currentUser.last_name || '');
    document.getElementById('profileRole').textContent =
        currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

    // Format dates
    if (currentUser.created_at) {
        const memberSince = new Date(currentUser.created_at).toLocaleDateString();
        document.getElementById('memberSince').textContent = memberSince;
    }

    if (currentUser.last_login) {
        const lastLogin = new Date(currentUser.last_login).toLocaleDateString();
        document.getElementById('lastLogin').textContent = lastLogin;
    }
}

function setupFormHandlers() {
    // Profile form handler
    document.getElementById('profileForm').addEventListener('submit', function (e) {
        e.preventDefault();
        updateProfile();
    });

    // Password form handler
    document.getElementById('passwordForm').addEventListener('submit', function (e) {
        e.preventDefault();
        changePassword();
    });
}

function updateProfile() {
    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        position: document.getElementById('position').value,
        address: document.getElementById('address').value
    };

    // Validate email uniqueness (except for current user)
    const users = StockWiseDB.db.getAll('users');
    const emailExists = users.find(u => u.email === formData.email && u.id !== currentUser.id);

    if (emailExists) {
        alert('Email address is already in use by another user.');
        return;
    }

    // Update user data
    const updatedUser = { ...currentUser, ...formData };

    if (StockWiseDB.db.update('users', currentUser.id, updatedUser)) {
        // Update current user session
        currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Log activity
        StockWiseDB.activity.log('profile_updated', 'Profile information updated');

        // Show success message
        showAlert('Profile updated successfully!', 'success');

        // Reload profile data
        loadProfileData();
    } else {
        showAlert('Failed to update profile. Please try again.', 'danger');
    }
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate current password
    if (!StockWiseDB.auth.validatePassword(currentPassword, currentUser.password)) {
        showAlert('Current password is incorrect.', 'danger');
        return;
    }

    // Validate new password
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long.', 'danger');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match.', 'danger');
        return;
    }

    // Update password
    const hashedPassword = StockWiseDB.auth.hashPassword(newPassword);
    const updatedUser = { ...currentUser, password: hashedPassword };

    if (StockWiseDB.db.update('users', currentUser.id, updatedUser)) {
        // Update current user session
        currentUser = updatedUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Log activity
        StockWiseDB.activity.log('password_changed', 'Password changed successfully');

        // Clear form
        document.getElementById('passwordForm').reset();

        // Show success message
        showAlert('Password changed successfully!', 'success');
    } else {
        showAlert('Failed to change password. Please try again.', 'danger');
    }
}

function resetForm() {
    loadProfileData();
    showAlert('Form reset to original values.', 'info');
}

function loadActivityLog() {
    const activities = StockWiseDB.activity.getUserActivities(currentUser.id).slice(0, 5);
    const container = document.getElementById('activityLog');

    if (activities.length === 0) {
        container.innerHTML = '<div class="p-3 text-muted text-center">No recent activity</div>';
        return;
    }

    container.innerHTML = activities.map(activity => {
        const date = new Date(activity.timestamp).toLocaleDateString();
        const time = new Date(activity.timestamp).toLocaleTimeString();

        return `
                    <div class="list-group-item">
                        <div class="d-flex w-100 justify-content-between">
                            <small class="text-primary">${activity.action.replace('_', ' ').toUpperCase()}</small>
                            <small class="text-muted">${date}</small>
                        </div>
                        <p class="mb-1">${activity.description}</p>
                        <small class="text-muted">${time}</small>
                    </div>
                `;
    }).join('');
}

function downloadProfile() {
    const profileData = {
        personal_info: {
            first_name: currentUser.first_name,
            last_name: currentUser.last_name,
            email: currentUser.email,
            phone: currentUser.phone,
            department: currentUser.department,
            position: currentUser.position,
            address: currentUser.address
        },
        account_info: {
            role: currentUser.role,
            created_at: currentUser.created_at,
            last_login: currentUser.last_login
        },
        activity_log: StockWiseDB.activity.getUserActivities(currentUser.id)
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `profile_${currentUser.email}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    StockWiseDB.activity.log('profile_downloaded', 'Profile data downloaded');
}

function showDeleteAccount() {
    const modal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
    modal.show();
}

function confirmDeleteAccount() {
    const password = document.getElementById('deleteConfirmPassword').value;

    if (!password) {
        alert('Please enter your password to confirm.');
        return;
    }

    if (!StockWiseDB.auth.validatePassword(password, currentUser.password)) {
        alert('Incorrect password.');
        return;
    }

    if (confirm('Are you absolutely sure? This action cannot be undone!')) {
        // Delete user account
        if (StockWiseDB.db.delete('users', currentUser.id)) {
            alert('Account deleted successfully.');
            logout();
        } else {
            alert('Failed to delete account. Please try again.');
        }
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-dismissible');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild.nextSibling);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        AuthManager.clearSession('User logout');
        window.location.href = '../index.html';
    }
}
