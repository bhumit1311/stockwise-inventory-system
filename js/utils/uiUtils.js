/**
 * StockWise UI Utilities
 * Provides reusable UI components and helpers
 */

class UIUtils {
    /**
     * Show loading spinner
     * @param {string} message - Loading message
     */
    static showLoader(message = 'Loading...') {
        // Remove existing loader if any
        this.hideLoader();
        
        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'global-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 mb-0">${message}</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        // Add styles if not already present
        if (!document.getElementById('loaderStyles')) {
            const style = document.createElement('style');
            style.id = 'loaderStyles';
            style.textContent = `
                .global-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                .loader-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Hide loading spinner
     */
    static hideLoader() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.remove();
        }
    }
    
    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toastContainer = this.getToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type} show`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${icons[type]} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.remove()"></button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    /**
     * Get or create toast container
     * @returns {HTMLElement} Toast container
     */
    static getToastContainer() {
        let container = document.getElementById('toastContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
            
            // Add styles if not already present
            if (!document.getElementById('toastStyles')) {
                const style = document.createElement('style');
                style.id = 'toastStyles';
                style.textContent = `
                    .toast-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9998;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .toast-notification {
                        min-width: 300px;
                        padding: 1rem 1.25rem;
                        border-radius: 8px;
                        color: white;
                        display: flex;
                        align-items: center;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        opacity: 0;
                        transform: translateX(100%);
                        transition: all 0.3s ease;
                    }
                    .toast-notification.show {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    .toast-success { background: #10b981; }
                    .toast-error { background: #ef4444; }
                    .toast-warning { background: #f59e0b; }
                    .toast-info { background: #3b82f6; }
                    .toast-notification .btn-close {
                        opacity: 0.8;
                    }
                    .toast-notification .btn-close:hover {
                        opacity: 1;
                    }
                    @media (max-width: 576px) {
                        .toast-container {
                            top: 10px;
                            right: 10px;
                            left: 10px;
                        }
                        .toast-notification {
                            min-width: auto;
                            width: 100%;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        return container;
    }
    
    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {string} title - Dialog title
     * @returns {Promise<boolean>} True if confirmed
     */
    static async confirm(message, title = 'Confirm Action') {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'confirmModal';
            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="cancelBtn">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            document.getElementById('confirmBtn').addEventListener('click', () => {
                bsModal.hide();
                resolve(true);
            });
            
            document.getElementById('cancelBtn').addEventListener('click', () => {
                bsModal.hide();
                resolve(false);
            });
            
            modal.addEventListener('hidden.bs.modal', () => {
                modal.remove();
            });
        });
    }
    
    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency symbol
     * @returns {string} Formatted currency
     */
    static formatCurrency(amount, currency = '₹') {
        return `${currency}${amount.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;
    }
    
    /**
     * Format date
     * @param {string|Date} date - Date to format
     * @param {string} format - Format type (short, long, time)
     * @returns {string} Formatted date
     */
    static formatDate(date, format = 'short') {
        const d = new Date(date);
        
        const formats = {
            short: { year: 'numeric', month: 'short', day: 'numeric' },
            long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            full: { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        return d.toLocaleDateString('en-US', formats[format] || formats.short);
    }
    
    /**
     * Animate counter
     * @param {HTMLElement} element - Element to animate
     * @param {number} target - Target number
     * @param {number} duration - Animation duration in ms
     */
    static animateCounter(element, target, duration = 2000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    static debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} True if successful
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success', 2000);
            return true;
        } catch (err) {
            this.showToast('Failed to copy', 'error', 2000);
            return false;
        }
    }
}

// Make available globally
window.UIUtils = UIUtils;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUtils;
}