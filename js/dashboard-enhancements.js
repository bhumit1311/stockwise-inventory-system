/**
 * StockWise - Dashboard Enhancements
 * Advanced features including notifications, real-time updates, and animations
 */

// ===== NOTIFICATION SYSTEM =====
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification-item`;
        notification.style.cssText = `
            margin-bottom: 10px;
            animation: slideInFromRight 0.5s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
            border-left: 4px solid var(--${type}-color);
        `;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            <strong>${this.getTitle(type)}</strong>
            <p class="mb-0">${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    remove(notification) {
        notification.style.animation = 'slideOutToRight 0.5s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 500);
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getTitle(type) {
        const titles = {
            success: 'Success!',
            danger: 'Error!',
            warning: 'Warning!',
            info: 'Info'
        };
        return titles[type] || 'Notification';
    }
}

// ===== REAL-TIME UPDATES =====
class RealTimeUpdates {
    constructor() {
        this.updateInterval = null;
        this.updateFrequency = 30000; // 30 seconds
    }

    start() {
        this.updateInterval = setInterval(() => {
            this.checkForUpdates();
        }, this.updateFrequency);
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    checkForUpdates() {
        // Check for low stock items
        this.checkLowStock();
        
        // Update statistics
        this.updateStatistics();
        
        // Check for new activities
        this.checkNewActivities();
    }

    checkLowStock() {
        if (typeof StockWiseDB === 'undefined') return;
        
        const products = StockWiseDB.db.getAll('products');
        const lowStockItems = products.filter(p => p.current_stock <= p.minimum_stock);
        
        if (lowStockItems.length > 0) {
            const message = `${lowStockItems.length} product(s) are running low on stock!`;
            window.notificationSystem?.show(message, 'warning', 10000);
        }
    }

    updateStatistics() {
        // Trigger counter animations
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            if (target) {
                animateCounter(counter.id, target);
            }
        });
    }

    checkNewActivities() {
        // This would check for new activities in a real application
    }
}

// ===== CHART SYSTEM =====
class ChartSystem {
    constructor() {
        this.charts = {};
    }

    createStockChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple bar chart implementation
        this.drawBarChart(ctx, data, canvas.width, canvas.height);
    }

    drawBarChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length;
        const maxValue = Math.max(...data.map(d => d.value));

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * barWidth;
            const y = height - padding - barHeight;

            // Create gradient
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, '#00d4ff');
            gradient.addColorStop(1, '#0056b3');

            ctx.fillStyle = gradient;
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - padding + 20);
            ctx.fillText(item.value, x + barWidth / 2, y - 10);
        });
    }

    createPieChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;

        const colors = ['#00d4ff', '#00ff88', '#ffaa00', '#ff4444', '#44aaff'];

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();

            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 2;
            ctx.stroke();

            currentAngle += sliceAngle;
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, options);

        // Observe all elements with scroll-reveal class
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            this.observer.observe(el);
        });
    }

    observe(element) {
        if (this.observer) {
            this.observer.observe(element);
        }
    }
}

// ===== DASHBOARD WIDGETS =====
class DashboardWidgets {
    constructor() {
        this.widgets = [];
    }

    createStockAlertWidget() {
        const widget = document.createElement('div');
        widget.className = 'card mb-4 hover-lift';
        widget.innerHTML = `
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-bell me-2"></i>Stock Alerts
                    <span class="badge bg-danger float-end notification-badge" data-count="0">0</span>
                </h5>
            </div>
            <div class="card-body" id="stockAlertContent">
                <div class="spinner"></div>
            </div>
        `;
        return widget;
    }

    createQuickStatsWidget() {
        const widget = document.createElement('div');
        widget.className = 'card mb-4 hover-lift';
        widget.innerHTML = `
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-chart-line me-2"></i>Quick Stats
                </h5>
            </div>
            <div class="card-body">
                <canvas id="quickStatsChart" width="400" height="200"></canvas>
            </div>
        `;
        return widget;
    }

    createRecentActivityWidget() {
        const widget = document.createElement('div');
        widget.className = 'card mb-4 hover-lift';
        widget.innerHTML = `
            <div class="card-header">
                <h5 class="mb-0">
                    <i class="fas fa-history me-2"></i>Recent Activity
                </h5>
            </div>
            <div class="card-body" id="recentActivityContent">
                <div class="spinner"></div>
            </div>
        `;
        return widget;
    }
}

// ===== THEME TOGGLE =====
class ThemeToggle {
    constructor() {
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        // Already using light theme, could add dark theme support here
    }
}

// ===== SEARCH ENHANCEMENT =====
class SearchEnhancement {
    constructor() {
        this.searchResults = [];
        this.init();
    }

    init() {
        const searchInputs = document.querySelectorAll('[data-search]');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.performSearch(e.target.value, e.target.dataset.search);
            });
        });
    }

    performSearch(query, type) {
        if (!query || query.length < 2) return;

        // Perform search based on type
        // Show search results with animation
        this.showResults(query, type);
    }

    showResults(query, type) {
        // Implementation for showing search results
    }
}

// ===== INITIALIZE ALL ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize notification system
    window.notificationSystem = new NotificationSystem();
    
    // Initialize real-time updates
    window.realTimeUpdates = new RealTimeUpdates();
    window.realTimeUpdates.start();
    
    // Initialize chart system
    window.chartSystem = new ChartSystem();
    
    // Initialize scroll animations
    window.scrollAnimations = new ScrollAnimations();
    
    // Initialize dashboard widgets
    window.dashboardWidgets = new DashboardWidgets();
    
    // Initialize theme toggle
    window.themeToggle = new ThemeToggle();
    
    // Initialize search enhancement
    window.searchEnhancement = new SearchEnhancement();
    
    // Show welcome notification
    setTimeout(() => {
        const user = StockWiseDB?.getCurrentUser();
        if (user) {
            window.notificationSystem.show(
                `Welcome back, ${user.username}! Dashboard loaded successfully.`,
                'success',
                3000
            );
        }
    }, 1000);
});

// ===== UTILITY FUNCTIONS =====
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const increment = (target - startValue) / (duration / 16);
    
    let currentValue = startValue;
    const timer = setInterval(() => {
        currentValue += increment;
        if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
            currentValue = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
}

// Add slideOutToRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutToRight {
        0% {
            transform: translateX(0);
            opacity: 1;
        }
        100% {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);