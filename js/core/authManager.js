/**
 * StockWise Centralized Authentication Manager
 * Single source of truth for all authentication state
 * Fixes: session confusion, auto-logout, storage conflicts
 */

class AuthManager {
    // Single storage key for all auth data
    static AUTH_KEY = 'stockwise_auth_state';
    static SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

    /**
     * Initialize auth manager
     */
    static init() {
        // Clean up old auth keys on first load
        this.migrateOldAuthData();

        // Set up session validation interval
        this.startSessionMonitor();

        // Listen for storage changes across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === this.AUTH_KEY) {
                this.handleStorageChange();
            }
        });
    }

    /**
     * Migrate old authentication data to new unified system
     */
    static migrateOldAuthData() {
        const oldKeys = ['stockwise_user', 'stockwise_current_user', 'stockwise_session'];
        let migratedUser = null;

        // Check for existing auth in old keys
        for (const key of oldKeys) {
            const data = localStorage.getItem(key) || sessionStorage.getItem(key);
            if (data && !migratedUser) {
                try {
                    migratedUser = JSON.parse(data);
                } catch (e) {
                    // Invalid data, skip
                }
            }
        }

        // If we found old auth data and no new auth exists
        if (migratedUser && !this.getAuthState()) {
            this.createSession(migratedUser, true);
        }

        // Clean up old keys (but preserve activity logs and other data)
        oldKeys.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
    }

    /**
     * Get current auth state
     * @returns {Object|null} Auth state or null
     */
    static getAuthState() {
        try {
            const data = localStorage.getItem(this.AUTH_KEY);
            if (!data) return null;

            const authState = JSON.parse(data);

            // Validate session hasn't expired
            if (this.isSessionExpired(authState)) {
                this.clearSession('Session expired');
                return null;
            }

            return authState;
        } catch (e) {
            console.error('Error reading auth state:', e);
            return null;
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    static isAuthenticated() {
        const authState = this.getAuthState();
        return authState !== null && authState.user !== null;
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    static getCurrentUser() {
        const authState = this.getAuthState();
        return authState ? authState.user : null;
    }

    /**
     * Check if session is expired
     * @param {Object} authState
     * @returns {boolean}
     */
    static isSessionExpired(authState) {
        if (!authState || !authState.expiresAt) return true;
        return Date.now() > authState.expiresAt;
    }

    /**
     * Create new session
     * @param {Object} user - User object
     * @param {boolean} rememberMe - Persist session
     * @returns {Object} Auth state
     */
    static createSession(user, rememberMe = false) {
        const authState = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            createdAt: Date.now(),
            expiresAt: Date.now() + this.SESSION_DURATION,
            rememberMe: rememberMe,
            lastActivity: Date.now()
        };

        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authState));

        // Log activity
        this.logActivity('LOGIN', user.username);

        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { authenticated: true, user: authState.user }
        }));

        return authState;
    }

    /**
     * Refresh session expiry
     */
    static refreshSession() {
        const authState = this.getAuthState();
        if (!authState) return false;

        authState.expiresAt = Date.now() + this.SESSION_DURATION;
        authState.lastActivity = Date.now();

        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authState));
        return true;
    }

    /**
     * Clear session (logout)
     * @param {string} reason - Reason for logout
     */
    static clearSession(reason = 'User logout') {
        const authState = this.getAuthState();
        const username = authState ? authState.user.username : 'unknown';

        // CRITICAL: Only remove auth key, preserve all other data
        localStorage.removeItem(this.AUTH_KEY);

        // Log activity
        this.logActivity('LOGOUT', username, reason);

        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { authenticated: false, user: null, reason }
        }));
    }

    /**
     * Check if user has required role
     * @param {string|string[]} requiredRole
     * @returns {boolean}
     */
    static hasRole(requiredRole) {
        const user = this.getCurrentUser();
        if (!user) return false;

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        return roles.includes(user.role);
    }

    /**
     * Require authentication with optional role check
     * @param {string|string[]} requiredRole - Required role(s)
     * @param {string} redirectUrl - Where to redirect if not authenticated
     * @returns {Object|null} User object or null
     */
    static requireAuth(requiredRole = null, redirectUrl = 'login.html') {
        const authState = this.getAuthState();

        // Not authenticated
        if (!authState) {
            this.redirectToLogin(redirectUrl);
            return null;
        }

        // Check role if specified
        if (requiredRole && !this.hasRole(requiredRole)) {
            alert('Access denied. You do not have permission to access this page.');
            this.redirectToDashboard(authState.user.role);
            return null;
        }

        // Refresh session on successful auth check
        this.refreshSession();

        return authState.user;
    }

    /**
     * Redirect to login page
     * @param {string} loginUrl
     */
    static redirectToLogin(loginUrl = 'login.html') {
        // Store current page for redirect after login
        sessionStorage.setItem('stockwise_redirect_after_login', window.location.pathname);
        window.location.href = loginUrl;
    }

    /**
     * Redirect to appropriate dashboard
     * @param {string} role
     */
    static redirectToDashboard(role) {
        const dashboards = {
            admin: 'admin-dashboard.html',
            staff: 'user-dashboard.html',
            user: 'user-dashboard.html'
        };

        window.location.href = dashboards[role] || 'user-dashboard.html';
    }

    /**
     * Handle redirect after login
     */
    static handlePostLoginRedirect() {
        const redirectUrl = sessionStorage.getItem('stockwise_redirect_after_login');
        sessionStorage.removeItem('stockwise_redirect_after_login');

        if (redirectUrl && redirectUrl !== '/pages/login.html') {
            window.location.href = redirectUrl;
        } else {
            const user = this.getCurrentUser();
            if (user) {
                this.redirectToDashboard(user.role);
            }
        }
    }

    /**
     * Start session monitoring
     */
    static startSessionMonitor() {
        // Check session every minute
        setInterval(() => {
            const authState = this.getAuthState();
            if (authState && this.isSessionExpired(authState)) {
                this.clearSession('Session expired');
                alert('Your session has expired. Please login again.');
                this.redirectToLogin();
            }
        }, 60000); // Check every minute
    }

    /**
     * Handle storage changes (for multi-tab sync)
     */
    static handleStorageChange() {
        const authState = this.getAuthState();

        // If logged out in another tab, logout here too
        if (!authState && window.location.pathname.includes('/pages/') &&
            !window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html')) {
            alert('You have been logged out in another tab.');
            this.redirectToLogin();
        }
    }

    /**
     * Log activity
     * @param {string} action
     * @param {string} username
     * @param {string} details
     */
    static logActivity(action, username, details = '') {
        try {
            const logs = JSON.parse(localStorage.getItem('stockwise_activity_logs') || '[]');

            logs.push({
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                action,
                username,
                details,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });

            // Keep only last 100 logs
            if (logs.length > 100) {
                logs.splice(0, logs.length - 100);
            }

            localStorage.setItem('stockwise_activity_logs', JSON.stringify(logs));
        } catch (e) {
            // Silently fail if logging fails
        }
    }

    /**
     * Update UI based on auth state
     */
    static updateUI() {
        const isAuth = this.isAuthenticated();
        const user = this.getCurrentUser();

        // Update username displays
        document.querySelectorAll('#currentUsername, [data-auth-username]').forEach(el => {
            if (user) {
                el.textContent = user.username;
            }
        });

        // Update auth-dependent buttons
        document.querySelectorAll('[data-auth-required]').forEach(el => {
            el.style.display = isAuth ? '' : 'none';
        });

        document.querySelectorAll('[data-guest-only]').forEach(el => {
            el.style.display = isAuth ? 'none' : '';
        });
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthManager.init());
} else {
    AuthManager.init();
}

// Listen for auth state changes
window.addEventListener('authStateChanged', () => {
    AuthManager.updateUI();
});

// Export for global use
window.AuthManager = AuthManager;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}