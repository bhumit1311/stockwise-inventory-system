/**
 * StockWise - user-dashboard Page JavaScript
 * Handles all functionality for the user-dashboard page
 */
// Check authentication on page load
document.addEventListener('DOMContentLoaded', function () {
    checkAuthentication();
    loadDashboardData();
    setupEventListeners();
});

function checkAuthentication() {
    // Use AuthManager for authentication check
    const user = AuthManager.requireAuth(null, 'login.html');
    if (!user) return;

    // Update UI with user info
    document.getElementById('currentUsername').textContent = user.username;
    document.getElementById('welcomeUsername').textContent = user.full_name || user.username;
    document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Set role badge color
    const roleBadge = document.getElementById('userRole');
    if (user.role === 'admin') {
        roleBadge.className = 'badge bg-danger';
    } else if (user.role === 'staff') {
        roleBadge.className = 'badge bg-warning';
    } else {
        roleBadge.className = 'badge bg-primary';
    }
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
    loadProductOverview();
    loadStockAlerts();
    loadCategoriesOverview();
}

function loadStatistics() {
    const products = StockWiseDB.db.getAll('products');
    const suppliers = StockWiseDB.db.getAll('suppliers');

    // Update product count
    const activeProducts = products.filter(p => p.status === 'active');
    document.getElementById('totalProducts').textContent = activeProducts.length;

    // Update supplier count
    const activeSuppliers = suppliers.filter(s => s.status === 'active');
    document.getElementById('totalSuppliers').textContent = activeSuppliers.length;

    // Update low stock count
    const lowStockItems = products.filter(p => p.current_stock <= p.minimum_stock);
    document.getElementById('lowStockItems').textContent = lowStockItems.length;
}

function loadProductOverview() {
    const products = StockWiseDB.db.getAll('products')
        .filter(p => p.status === 'active')
        .slice(0, 10); // Show only first 10 products

    const tbody = document.getElementById('productOverview');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No products available</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product);
        return `
                    <tr>
                        <td>
                            <strong>${product.product_name}</strong><br>
                            <small class="text-muted">${product.product_code}</small>
                        </td>
                        <td>${product.category}</td>
                        <td>
                            <span class="badge ${stockStatus.class}">${product.current_stock} ${product.unit}</span>
                        </td>
                        <td>
                            <span class="badge ${stockStatus.class}">${stockStatus.text}</span>
                        </td>
                    </tr>
                `;
    }).join('');
}

function loadStockAlerts() {
    const products = StockWiseDB.db.getAll('products');
    const lowStockItems = products.filter(p => p.current_stock <= p.minimum_stock);

    const container = document.getElementById('stockAlerts');

    if (lowStockItems.length === 0) {
        container.innerHTML = '<div class="alert alert-success">All products are well stocked!</div>';
        return;
    }

    container.innerHTML = lowStockItems.slice(0, 5).map(product => `
                <div class="alert alert-warning mb-2">
                    <strong>${product.product_name}</strong><br>
                    <small>Current: ${product.current_stock} | Min: ${product.minimum_stock}</small>
                </div>
            `).join('');

    if (lowStockItems.length > 5) {
        container.innerHTML += `<div class="alert alert-info">And ${lowStockItems.length - 5} more items...</div>`;
    }
}

function loadCategoriesOverview() {
    const products = StockWiseDB.db.getAll('products');
    const categories = StockWiseDB.db.getAll('categories');

    const container = document.getElementById('categoriesOverview');

    if (categories.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No categories available</p></div>';
        return;
    }

    container.innerHTML = categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category.name);
        const lowStockCount = categoryProducts.filter(p => p.current_stock <= p.minimum_stock).length;

        return `
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body text-center">
                                <h6 class="card-title text-dark mb-3">${category.name}</h6>
                                <p class="card-text mb-0">
                                    <span class="badge bg-primary">${categoryProducts.length} products</span>
                                    ${lowStockCount > 0 ? `<span class="badge bg-warning ms-1">${lowStockCount} low stock</span>` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                `;
    }).join('');
}

function loadRecentActivity() {
    try {
        const activities = StockWiseDB.db.getAll('activity_logs')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        const container = document.getElementById('recentActivity');

        if (!container) {
            console.error('Recent activity container not found');
            return;
        }


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
    } catch (error) {
        console.error('Error loading recent activity:', error);
        const container = document.getElementById('recentActivity');
        if (container) {
            container.innerHTML = '<p class="text-danger">Error loading activity data</p>';
        }
    }
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
    switch (activity.action) {
        case 'INSERT':
            return `added a new ${activity.table_name ? activity.table_name.replace(/_/g, ' ') : 'item'}`;
        case 'UPDATE':
            return `updated a ${activity.table_name ? activity.table_name.replace(/_/g, ' ') : 'item'}`;
        case 'DELETE':
            return `deleted a ${activity.table_name ? activity.table_name.replace(/_/g, ' ') : 'item'}`;
        case 'LOGIN':
            return 'logged in';
        case 'LOGOUT':
            return 'logged out';
        default:
            return `performed ${activity.action}`;
    }
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

function getStockStatus(product) {
    if (product.current_stock <= product.minimum_stock) {
        return { class: 'bg-danger', text: 'Low Stock' };
    } else if (product.current_stock <= product.minimum_stock * 2) {
        return { class: 'bg-warning', text: 'Medium Stock' };
    } else {
        return { class: 'bg-success', text: 'Good Stock' };
    }
}

function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            AuthManager.clearSession('User logout');
            window.location.href = '../index.html';
        }
    });
}

// Quick action functions
function viewProducts() {
    window.location.href = 'products.html';
}

function viewSuppliers() {
    window.location.href = 'suppliers.html';
}

function checkStock() {
    window.location.href = 'stock-movement.html';
}

function viewAlerts() {
    const lowStockItems = StockWiseDB.db.getAll('products').filter(p => p.current_stock <= p.minimum_stock);
    if (lowStockItems.length === 0) {
        alert('No stock alerts at this time. All products are well stocked!');
    } else {
        const alertList = lowStockItems.map(p => `â€¢ ${p.product_name}: ${p.current_stock} remaining`).join('\n');
        alert(`Low Stock Alerts:\n\n${alertList}`);
    }
}
