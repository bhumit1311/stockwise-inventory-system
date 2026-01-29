/**
 * StockWise Authentication Guard
 * Protects pages and enforces role-based access control
 */

class AuthGuard {
    /**
     * Check if user is authenticated and has required role
     * @param {string|string[]} requiredRole - Required role(s) to access the page
     * @param {string} redirectUrl - URL to redirect if not authorized (default: login.html)
     * @returns {Object|null} User object if authorized, null otherwise
     */
    static requireAuth(requiredRole = null, redirectUrl = 'login.html') {
        const session = this.getSession();
        
        // Check if session exists
        if (!session) {
            this.redirectToLogin(redirectUrl);
            return null;
        }
        
        // Check if session is expired
        if (this.isSessionExpired(session)) {
            this.clearSession();
            alert('Your session has expired. Please login again.');
            this.redirectToLogin(redirectUrl);
            return null;
        }
        
        // Check role if specified
        if (requiredRole) {
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            if (!roles.includes(session.user.role)) {
                alert('Access denied. You do not have permission to access this page.');
                this.redirectToDashboard(session.user.role);
                return null;
            }
        }
        
        // Refresh session expiry
        this.refreshSession(session);
        
        return session.user;
    }
    
    /**
     * Get current session
     * @returns {Object|null} Session object or null
     */
    static getSession() {
        const sessionData = localStorage.getItem('stockwise_session') || 
                           sessionStorage.getItem('stockwise_session');
        
        if (!sessionData) {
            return null;
        }
        
        try {
            return JSON.parse(sessionData);
        } catch (e) {
            return null;
        }
    }
    
    /**
     * Create new session
     * @param {Object} user - User object
     * @param {boolean} rememberMe - Whether to persist session
     * @returns {Object} Session object
     */
    static createSession(user, rememberMe = false) {
        const session = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            loginTime: Date.now(),
            expires: Date.now() + (60 * 60 * 1000), // 1 hour
            rememberMe: rememberMe
        };
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('stockwise_session', JSON.stringify(session));
        
        // Also set current user for backward compatibility
        localStorage.setItem('stockwise_current_user', JSON.stringify(session.user));
        
        return session;
    }
    
    /**
     * Check if session is expired
     * @param {Object} session - Session object
     * @returns {boolean} True if expired
     */
    static isSessionExpired(session) {
        if (!session || !session.expires) {
            return true;
        }
        return Date.now() > session.expires;
    }
    
    /**
     * Refresh session expiry time
     * @param {Object} session - Session object
     */
    static refreshSession(session) {
        session.expires = Date.now() + (60 * 60 * 1000); // Extend by 1 hour
        const storage = session.rememberMe ? localStorage : sessionStorage;
        storage.setItem('stockwise_session', JSON.stringify(session));
    }
    
    /**
     * Clear session and logout
     */
    static clearSession() {
        localStorage.removeItem('stockwise_session');
        sessionStorage.removeItem('stockwise_session');
        localStorage.removeItem('stockwise_current_user');
        localStorage.removeItem('stockwise_user');
    }
    
    /**
     * Redirect to login page
     * @param {string} redirectUrl - Login page URL
     */
    static redirectToLogin(redirectUrl = 'login.html') {
        window.location.href = redirectUrl;
    }
    
    /**
     * Redirect to appropriate dashboard based on role
     * @param {string} role - User role
     */
    static redirectToDashboard(role) {
        const dashboards = {
            admin: 'admin-dashboard.html',
            user: 'user-dashboard.html',
            staff: 'user-dashboard.html'
        };
        
        window.location.href = dashboards[role] || 'user-dashboard.html';
    }
    
    /**
     * Check if user has specific permission
     * @param {string} permission - Permission to check
     * @returns {boolean} True if user has permission
     */
    static hasPermission(permission) {
        const session = this.getSession();
        if (!session) return false;
        
        const permissions = {
            admin: ['all'],
            user: ['view_products', 'view_stock', 'view_reports'],
            staff: ['view_products', 'view_stock', 'update_stock']
        };
        
        const userPermissions = permissions[session.user.role] || [];
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
}

// Make available globally
window.AuthGuard = AuthGuard;