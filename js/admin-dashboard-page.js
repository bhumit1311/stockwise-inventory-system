/**
 * StockWise - admin-dashboard Page JavaScript
 * Handles all functionality for the admin-dashboard page
 */
// Check authentication on page load
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthentication();
            loadDashboardData();
            setupEventListeners();
        });

        function checkAuthentication() {
            // Use AuthManager for unified auth check
            const user = typeof AuthManager !== 'undefined'
                ? AuthManager.requireAuth('admin', 'login.html')
                : StockWiseDB.getCurrentUser();
            
            if (!user) {
                return; // AuthManager handles redirect
            }

            // Update UI with user info
            document.getElementById('currentUsername').textContent = user.username;
            document.getElementById('welcomeUsername').textContent = user.full_name || user.username;
        }

        function loadDashboardData() {
            // Update current date
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Load statistics
            loadStatistics();
            loadRecentActivity();
            loadLowStockAlerts();
        }

        function loadStatistics() {
            const products = StockWiseDB.db.getAll('products');
            const suppliers = StockWiseDB.db.getAll('suppliers');
            const users = StockWiseDB.db.getAll('users');

            // Update product count with animation
            const productCount = products.length;
            animateCounter('totalProducts', productCount);
            animateProgress('productsProgress', Math.min((productCount / 100) * 100, 100));

            // Update supplier count with animation
            const activeSuppliers = suppliers.filter(s => s.status === 'active');
            animateCounter('totalSuppliers', activeSuppliers.length);
            animateProgress('suppliersProgress', Math.min((activeSuppliers.length / 50) * 100, 100));

            // Update low stock count with animation
            const lowStockItems = products.filter(p => p.current_stock <= p.minimum_stock);
            animateCounter('lowStockItems', lowStockItems.length);
            animateProgress('lowStockProgress', Math.min((lowStockItems.length / 20) * 100, 100));

            // Update user count with animation
            animateCounter('totalUsers', users.length);
            animateProgress('usersProgress', Math.min((users.length / 20) * 100, 100));
        }

        // Animated counter function
        function animateCounter(elementId, target) {
            const element = document.getElementById(elementId);
            element.setAttribute('data-target', target);
            const startValue = parseInt(element.textContent) || 0;
            const duration = 2000; // 2 seconds
            const increment = (target - startValue) / (duration / 16); // 60fps

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

        // Animated progress bar function
        function animateProgress(elementId, targetPercentage) {
            const element = document.getElementById(elementId);
            const duration = 2000; // 2 seconds
            const startWidth = parseFloat(element.style.width) || 0;
            const increment = (targetPercentage - startWidth) / (duration / 16);

            let currentWidth = startWidth;
            const timer = setInterval(() => {
                currentWidth += increment;
                if ((increment > 0 && currentWidth >= targetPercentage) || (increment < 0 && currentWidth <= targetPercentage)) {
                    currentWidth = targetPercentage;
                    clearInterval(timer);
                }
                element.style.width = currentWidth + '%';
            }, 16);
        }

        function loadRecentActivity() {
            const activities = StockWiseDB.db.getAll('activity_logs')
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10);

            const container = document.getElementById('recentActivity');
            
            if (activities.length === 0) {
                container.innerHTML = '<p class="text-muted">No recent activity</p>';
                return;
            }

            container.innerHTML = activities.map(activity => `
                <div class="activity-item d-flex align-items-center mb-3">
                    <div class="activity-icon me-3">
                        <i class="fas fa-${getActivityIcon(activity.action)} text-primary"></i>
                    </div>
                    <div class="activity-content flex-grow-1">
                        <div class="activity-text">
                            <strong>${activity.username}</strong> ${getActivityText(activity)}
                        </div>
                        <small class="text-muted">${formatDate(activity.timestamp)}</small>
                    </div>
                </div>
            `).join('');
        }

        function loadLowStockAlerts() {
            const products = StockWiseDB.db.getAll('products');
            const lowStockItems = products.filter(p => p.current_stock <= p.minimum_stock);

            const container = document.getElementById('lowStockAlerts');
            
            if (lowStockItems.length === 0) {
                container.innerHTML = '<div class="alert alert-success">All products are well stocked!</div>';
                return;
            }

            container.innerHTML = lowStockItems.map(product => `
                <div class="alert alert-warning mb-2">
                    <strong>${product.product_name}</strong><br>
                    <small>Stock: ${product.current_stock} / Min: ${product.minimum_stock}</small>
                </div>
            `).join('');
        }

        function getActivityIcon(action) {
            const icons = {
                'INSERT': 'plus',
                'UPDATE': 'edit',
                'DELETE': 'trash',
                'LOGIN': 'sign-in-alt',
                'LOGOUT': 'sign-out-alt'
            };
            return icons[action] || 'info';
        }

        function getActivityText(activity) {
            const actions = {
                'INSERT': `added a new ${activity.table_name.replace('_', ' ')}`,
                'UPDATE': `updated a ${activity.table_name.replace('_', ' ')}`,
                'DELETE': `deleted a ${activity.table_name.replace('_', ' ')}`,
                'LOGIN': 'logged in',
                'LOGOUT': 'logged out'
            };
            return actions[activity.action] || `performed ${activity.action}`;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes} minutes ago`;
            if (hours < 24) return `${hours} hours ago`;
            if (days < 7) return `${days} days ago`;
            return date.toLocaleDateString();
        }

        function setupEventListeners() {
            // Logout button
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    // Use AuthManager for proper logout (preserves app identity)
                    if (typeof AuthManager !== 'undefined') {
                        AuthManager.clearSession('User logout');
                    } else {
                        StockWiseDB.logoutUser();
                    }
                    window.location.href = '../index.html';
                }
            });
        }

        // Quick action functions
        function addProduct() {
            window.location.href = 'products.html';
        }

        function addSupplier() {
            window.location.href = 'suppliers.html';
        }

        function addUser() {
            window.location.href = 'users.html';
        }

        function generateReport() {
            window.location.href = 'reports.html';
        }
