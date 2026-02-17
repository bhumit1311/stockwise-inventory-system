/**
 * StockWise - stock-movement Page JavaScript
 * Handles all functionality for the stock-movement page
 */
let currentMovements = [];
let sortDirection = {};
let currentTransactionType = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    checkAuthentication();
    loadProducts();
    loadSuppliers();
    loadStockMovements();
    loadStatistics();
    setupEventListeners();
    setDefaultDates();
});

function checkAuthentication() {
    // Use AuthManager for authentication check
    const user = AuthManager.requireAuth(null, 'login.html');
    if (!user) return;

    document.getElementById('currentUsername').textContent = user.username;

    // Show admin-only navigation items
    if (user.role === 'admin') {
        document.getElementById('usersNavItem').style.display = 'block';
        document.getElementById('reportsNavItem').style.display = 'block';
    }
}

function goToDashboard() {
    const user = AuthManager.getCurrentUser();
    if (user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'user-dashboard.html';
    }
}

function setupEventListeners() {
    // Search and filter inputs
    document.getElementById('searchInput').addEventListener('input', filterMovements);
    document.getElementById('typeFilter').addEventListener('change', filterMovements);
    document.getElementById('dateFromFilter').addEventListener('change', filterMovements);
    document.getElementById('dateToFilter').addEventListener('change', filterMovements);
    document.getElementById('productFilter').addEventListener('change', filterMovements);

    // Quantity input for real-time calculation
    document.getElementById('quantity').addEventListener('input', calculateNewStock);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            AuthManager.clearSession('User logout');
            window.location.href = '../index.html';
        }
    });
}

function setDefaultDates() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    document.getElementById('dateFromFilter').value = oneMonthAgo.toISOString().split('T')[0];
    document.getElementById('dateToFilter').value = today.toISOString().split('T')[0];
}

function loadProducts() {
    const products = StockWiseDB.db.getAll('products').filter(p => p.status === 'active');
    const productSelect = document.getElementById('product');
    const productFilter = document.getElementById('productFilter');

    productSelect.innerHTML = '<option value="">Select Product</option>';
    productFilter.innerHTML = '<option value="">All Products</option>';

    products.forEach(product => {
        const option = `<option value="${product.id}">${product.product_name} (${product.product_code})</option>`;
        productSelect.innerHTML += option;
        productFilter.innerHTML += option;
    });
}

function loadSuppliers() {
    const suppliers = StockWiseDB.db.getAll('suppliers').filter(s => s.status === 'active');
    const supplierSelect = document.getElementById('supplier');

    supplierSelect.innerHTML = '<option value="">Select Supplier</option>';

    suppliers.forEach(supplier => {
        supplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.supplier_name}</option>`;
    });
}

function loadStockMovements() {
    currentMovements = StockWiseDB.db.getAll('stock_logs');
    displayMovements(currentMovements);
}

function loadStatistics() {
    const movements = StockWiseDB.db.getAll('stock_logs');
    const today = new Date().toDateString();

    const stockIn = movements.filter(m => m.transaction_type === 'in').length;
    const stockOut = movements.filter(m => m.transaction_type === 'out').length;
    const todayTransactions = movements.filter(m => new Date(m.created_at).toDateString() === today).length;

    document.getElementById('totalStockIn').textContent = stockIn;
    document.getElementById('totalStockOut').textContent = stockOut;
    document.getElementById('todayTransactions').textContent = todayTransactions;
}

function displayMovements(movements) {
    const tbody = document.getElementById('stockMovementTableBody');
    const transactionCount = document.getElementById('transactionCount');

    transactionCount.textContent = movements.length;

    if (movements.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="10" class="text-center py-4">
                            <i class="fas fa-exchange-alt fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No stock movements found</p>
                        </td>
                    </tr>
                `;
        return;
    }

    tbody.innerHTML = movements.map(movement => {
        const product = StockWiseDB.db.getById('products', movement.product_id);
        const user = StockWiseDB.db.getById('users', movement.user_id);
        const typeClass = getTransactionTypeClass(movement.transaction_type);
        const quantityDisplay = getQuantityDisplay(movement);

        return `
                    <tr>
                        <td>
                            <small>${new Date(movement.created_at).toLocaleString()}</small>
                        </td>
                        <td>
                            <code>${movement.reference}</code>
                        </td>
                        <td>
                            <strong>${product ? product.product_name : 'Unknown Product'}</strong>
                            ${product ? `<br><small class="text-muted">${product.product_code}</small>` : ''}
                        </td>
                        <td>
                            <span class="badge ${typeClass}">${movement.transaction_type.charAt(0).toUpperCase() + movement.transaction_type.slice(1)}</span>
                        </td>
                        <td>
                            <strong class="${quantityDisplay.class}">${quantityDisplay.text}</strong>
                        </td>
                        <td>${movement.previous_stock}</td>
                        <td><strong>${movement.new_stock}</strong></td>
                        <td>
                            <small>${user ? user.username : 'Unknown User'}</small>
                        </td>
                        <td>
                            <small>${movement.notes || '-'}</small>
                        </td>
                        <td>
                            <button class="btn btn-outline-info btn-sm" onclick="viewMovement('${movement.id}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
    }).join('');
}

function getTransactionTypeClass(type) {
    switch (type) {
        case 'in': return 'bg-success';
        case 'out': return 'bg-warning';
        case 'adjustment': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function getQuantityDisplay(movement) {
    const quantity = movement.quantity;
    switch (movement.transaction_type) {
        case 'in':
            return { text: `+${quantity}`, class: 'text-success' };
        case 'out':
            return { text: `-${quantity}`, class: 'text-warning' };
        case 'adjustment':
            const diff = movement.new_stock - movement.previous_stock;
            return {
                text: diff >= 0 ? `+${diff}` : `${diff}`,
                class: diff >= 0 ? 'text-success' : 'text-danger'
            };
        default:
            return { text: quantity, class: '' };
    }
}

function filterMovements() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFrom = document.getElementById('dateFromFilter').value;
    const dateTo = document.getElementById('dateToFilter').value;
    const productFilter = document.getElementById('productFilter').value;

    let filteredMovements = currentMovements.filter(movement => {
        const product = StockWiseDB.db.getById('products', movement.product_id);
        const productName = product ? product.product_name.toLowerCase() : '';
        const reference = movement.reference.toLowerCase();

        const matchesSearch = productName.includes(searchTerm) || reference.includes(searchTerm);
        const matchesType = !typeFilter || movement.transaction_type === typeFilter;
        const matchesProduct = !productFilter || movement.product_id === productFilter;

        let matchesDate = true;
        if (dateFrom || dateTo) {
            const movementDate = new Date(movement.created_at).toISOString().split('T')[0];
            if (dateFrom && movementDate < dateFrom) matchesDate = false;
            if (dateTo && movementDate > dateTo) matchesDate = false;
        }

        return matchesSearch && matchesType && matchesProduct && matchesDate;
    });

    displayMovements(filteredMovements);
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('productFilter').value = '';
    setDefaultDates();
    displayMovements(currentMovements);
}

function sortTable(column) {
    const direction = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    sortDirection[column] = direction;

    currentMovements.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (column === 'product_name') {
            const productA = StockWiseDB.db.getById('products', a.product_id);
            const productB = StockWiseDB.db.getById('products', b.product_id);
            aVal = productA ? productA.product_name.toLowerCase() : '';
            bVal = productB ? productB.product_name.toLowerCase() : '';
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    displayMovements(currentMovements);
}

function openStockModal(type) {
    currentTransactionType = type;
    document.getElementById('transactionType').value = type;
    document.getElementById('stockForm').reset();

    // Update modal title and appearance based on type
    const modal = document.getElementById('stockModal');
    const title = document.getElementById('stockModalTitle');
    const reasonField = document.getElementById('reasonField');
    const supplierField = document.getElementById('supplierField');

    switch (type) {
        case 'in':
            title.innerHTML = '<i class="fas fa-plus me-2 text-success"></i>Stock In';
            modal.querySelector('.modal-header').className = 'modal-header bg-success text-white';
            reasonField.style.display = 'block';
            supplierField.style.display = 'block';
            document.getElementById('reason').required = true;
            break;
        case 'out':
            title.innerHTML = '<i class="fas fa-minus me-2 text-warning"></i>Stock Out';
            modal.querySelector('.modal-header').className = 'modal-header bg-warning text-dark';
            reasonField.style.display = 'block';
            supplierField.style.display = 'none';
            document.getElementById('reason').required = true;
            break;
    }

    // Generate reference number
    document.getElementById('reference').value = generateReference(type);
}

function generateReference(type) {
    const prefix = type.toUpperCase().substring(0, 2);
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
}

function updateProductInfo() {
    const productId = document.getElementById('product').value;
    if (!productId) {
        document.getElementById('currentStock').value = '';
        document.getElementById('newStock').value = '';
        return;
    }

    const product = StockWiseDB.db.getById('products', productId);
    if (product) {
        document.getElementById('currentStock').value = `${product.current_stock} ${product.unit}`;
        calculateNewStock();
    }
}

function calculateNewStock() {
    const productId = document.getElementById('product').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;

    if (!productId || !quantity) {
        document.getElementById('newStock').value = '';
        return;
    }

    const product = StockWiseDB.db.getById('products', productId);
    if (!product) return;

    let newStock = product.current_stock;

    switch (currentTransactionType) {
        case 'in':
            newStock += quantity;
            break;
        case 'out':
            newStock -= quantity;
            break;
    }

    document.getElementById('newStock').value = `${newStock} ${product.unit}`;

    // Warn if stock will go negative
    if (newStock < 0) {
        document.getElementById('newStock').classList.add('text-danger');
    } else {
        document.getElementById('newStock').classList.remove('text-danger');
    }
}

function saveStockMovement() {
    const form = document.getElementById('stockForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const productId = document.getElementById('product').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const reason = document.getElementById('reason').value;

    const product = StockWiseDB.db.getById('products', productId);
    if (!product) {
        showAlert('Selected product not found.', 'danger');
        return;
    }

    // Validate stock levels for out transactions
    if (currentTransactionType === 'out' && quantity > product.current_stock) {
        if (!confirm(`This will result in negative stock (${product.current_stock - quantity}). Continue?`)) {
            return;
        }
    }

    const currentUser = AuthManager.getCurrentUser();
    const previousStock = product.current_stock;
    let newStock = previousStock;

    // Calculate new stock based on transaction type
    switch (currentTransactionType) {
        case 'in':
            newStock = previousStock + quantity;
            break;
        case 'out':
            newStock = previousStock - quantity;
            break;
    }

    const movementData = {
        product_id: productId,
        transaction_type: currentTransactionType,
        quantity: quantity,
        previous_stock: previousStock,
        new_stock: newStock,
        reference: document.getElementById('reference').value || generateReference(currentTransactionType),
        reason: reason,
        supplier_id: document.getElementById('supplier').value || null,
        notes: document.getElementById('notes').value.trim(),
        user_id: currentUser.id
    };

    try {
        // Save stock movement
        StockWiseDB.db.insert('stock_logs', movementData);

        // Update product stock
        StockWiseDB.db.update('products', productId, { current_stock: newStock });

        showAlert('Stock movement recorded successfully!', 'success');

        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('stockModal')).hide();
        loadStockMovements();
        loadStatistics();

    } catch (error) {
        console.error('Error saving stock movement:', error);
        showAlert('Error recording stock movement. Please try again.', 'danger');
    }
}

function viewMovement(id) {
    const movement = StockWiseDB.db.getById('stock_logs', id);
    if (!movement) return;

    const product = StockWiseDB.db.getById('products', movement.product_id);
    const user = StockWiseDB.db.getById('users', movement.user_id);
    const supplier = movement.supplier_id ? StockWiseDB.db.getById('suppliers', movement.supplier_id) : null;

    const typeClass = getTransactionTypeClass(movement.transaction_type);
    const quantityDisplay = getQuantityDisplay(movement);

    const modalContent = `
                <div class="row g-3">
                    <div class="col-md-6"><strong>Reference:</strong><br><code>${movement.reference}</code></div>
                    <div class="col-md-6"><strong>Date:</strong><br>${new Date(movement.created_at).toLocaleString()}</div>
                    <div class="col-md-6"><strong>Product:</strong><br>${product ? product.product_name : 'Unknown Product'}</div>
                    <div class="col-md-6"><strong>Product Code:</strong><br><code>${product ? product.product_code : 'N/A'}</code></div>
                    <div class="col-md-6"><strong>Transaction Type:</strong><br><span class="badge ${typeClass}">${movement.transaction_type.charAt(0).toUpperCase() + movement.transaction_type.slice(1)}</span></div>
                    <div class="col-md-6"><strong>Quantity:</strong><br><span class="${quantityDisplay.class}">${quantityDisplay.text}</span></div>
                    <div class="col-md-6"><strong>Previous Stock:</strong><br>${movement.previous_stock}</div>
                    <div class="col-md-6"><strong>New Stock:</strong><br><strong>${movement.new_stock}</strong></div>
                    <div class="col-md-6"><strong>Reason:</strong><br>${movement.reason || 'Not specified'}</div>
                    <div class="col-md-6"><strong>User:</strong><br>${user ? user.full_name : 'Unknown User'}</div>
                    ${supplier ? `<div class="col-md-6"><strong>Supplier:</strong><br>${supplier.supplier_name}</div>` : ''}
                    ${movement.notes ? `<div class="col-12"><strong>Notes:</strong><br>${movement.notes}</div>` : ''}
                </div>
            `;

    // Create and show view modal
    const viewModal = document.createElement('div');
    viewModal.className = 'modal fade';
    viewModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-dark text-white">
                            <h5 class="modal-title"><i class="fas fa-eye me-2"></i>Stock Movement Details</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${modalContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;

    document.body.appendChild(viewModal);
    const modal = new bootstrap.Modal(viewModal);
    modal.show();

    // Remove modal from DOM when hidden
    viewModal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(viewModal);
    });
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}


