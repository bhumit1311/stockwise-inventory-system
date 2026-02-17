/**
 * StockWise - suppliers Page JavaScript
 * Handles all functionality for the suppliers page
 */
let currentSuppliers = [];
let sortDirection = {};
let currentEditingId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    checkAuthentication();
    loadSuppliers();
    loadLocationFilters();
    setupEventListeners();
});

function checkAuthentication() {
    // Use AuthManager for authentication check
    const user = AuthManager.requireAuth(null, 'login.html');
    if (!user) return;

    document.getElementById('currentUsername').textContent = user.username;

    // Hide add/edit/delete buttons for staff
    if (user.role === 'staff') {
        // Hide add supplier button
        const addSupplierBtn = document.querySelector('[onclick="openAddSupplierModal()"]');
        if (addSupplierBtn) addSupplierBtn.style.display = 'none';
    }

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
    // Search input
    document.getElementById('searchInput').addEventListener('input', filterSuppliers);

    // Filter dropdowns
    document.getElementById('statusFilter').addEventListener('change', filterSuppliers);
    document.getElementById('countryFilter').addEventListener('change', filterSuppliers);
    document.getElementById('cityFilter').addEventListener('change', filterSuppliers);
    document.getElementById('hasProductsFilter').addEventListener('change', filterSuppliers);
    document.getElementById('sortBy').addEventListener('change', filterSuppliers);
    document.getElementById('sortOrder').addEventListener('change', filterSuppliers);

    // Date filters
    document.getElementById('startDate').addEventListener('change', filterSuppliers);
    document.getElementById('endDate').addEventListener('change', filterSuppliers);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            AuthManager.clearSession('User logout');
            window.location.href = '../index.html';
        }
    });
}

function loadSuppliers() {
    currentSuppliers = StockWiseDB.db.getAll('suppliers');
    displaySuppliers(currentSuppliers);
}

function displaySuppliers(suppliers) {
    const tbody = document.getElementById('suppliersTableBody');
    const supplierCount = document.getElementById('supplierCount');

    supplierCount.textContent = suppliers.length;

    if (suppliers.length === 0) {
        tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            <i class="fas fa-truck fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No suppliers found</p>
                        </td>
                    </tr>
                `;
        return;
    }

    tbody.innerHTML = suppliers.map(supplier => {
        const products = StockWiseDB.db.find('products', { supplier_id: supplier.id });
        const statusClass = supplier.status === 'active' ? 'bg-success' : 'bg-secondary';
        const user = AuthManager.getCurrentUser();
        const isStaff = user && user.role === 'staff';

        return `
                    <tr>
                        <td>
                            <strong>${supplier.supplier_name}</strong>
                            ${supplier.website ? `<br><a href="${supplier.website}" target="_blank" class="text-primary"><i class="fas fa-external-link-alt"></i> Website</a>` : ''}
                        </td>
                        <td>${supplier.contact_person}</td>
                        <td>
                            <i class="fas fa-envelope me-1"></i>${supplier.email}<br>
                            <i class="fas fa-phone me-1"></i>${supplier.phone}
                        </td>
                        <td>
                            <small>${supplier.address}</small>
                        </td>
                        <td><span class="badge ${statusClass}">${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span></td>
                        <td>
                            <span class="badge bg-info">${products.length} products</span>
                        </td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                ${!isStaff ? `
                                <button class="btn btn-outline-primary" onclick="editSupplier('${supplier.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                ` : ''}
                                <button class="btn btn-outline-info" onclick="viewSupplier('${supplier.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-success" onclick="viewSupplierProducts('${supplier.id}')" title="View Products">
                                    <i class="fas fa-boxes"></i>
                                </button>
                                ${!isStaff ? `
                                <button class="btn btn-outline-danger" onclick="deleteSupplier('${supplier.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                                ` : ''}
                            </div>
                        </td>
                    </tr>
                `;
    }).join('');
}

function loadLocationFilters() {
    const suppliers = StockWiseDB.db.getAll('suppliers');
    const countries = [...new Set(suppliers.map(s => s.country).filter(Boolean))].sort();
    const cities = [...new Set(suppliers.map(s => s.city).filter(Boolean))].sort();

    const countryFilter = document.getElementById('countryFilter');
    const cityFilter = document.getElementById('cityFilter');

    countryFilter.innerHTML = '<option value="">All Countries</option>';
    cityFilter.innerHTML = '<option value="">All Cities</option>';

    countries.forEach(country => {
        countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
    });

    cities.forEach(city => {
        cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

function filterSuppliers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const countryFilter = document.getElementById('countryFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const hasProductsFilter = document.getElementById('hasProductsFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let filteredSuppliers = currentSuppliers.filter(supplier => {
        // Search filter - check name, contact person, email, and address
        const matchesSearch = !searchTerm ||
            supplier.supplier_name.toLowerCase().includes(searchTerm) ||
            supplier.contact_person.toLowerCase().includes(searchTerm) ||
            supplier.email.toLowerCase().includes(searchTerm) ||
            (supplier.address && supplier.address.toLowerCase().includes(searchTerm));

        // Status filter
        const matchesStatus = !statusFilter || supplier.status === statusFilter;

        // Country filter
        const matchesCountry = !countryFilter || supplier.country === countryFilter;

        // City filter
        const matchesCity = !cityFilter || supplier.city === cityFilter;

        // Products filter
        let matchesProducts = true;
        if (hasProductsFilter) {
            const products = StockWiseDB.db.find('products', { supplier_id: supplier.id });
            matchesProducts = hasProductsFilter === 'yes' ? products.length > 0 : products.length === 0;
        }

        // Date range filter
        let matchesDateRange = true;
        if (startDate || endDate) {
            const supplierDate = new Date(supplier.created_at || supplier.id);
            if (startDate) {
                matchesDateRange = matchesDateRange && supplierDate >= new Date(startDate);
            }
            if (endDate) {
                matchesDateRange = matchesDateRange && supplierDate <= new Date(endDate + 'T23:59:59');
            }
        }

        return matchesSearch && matchesStatus && matchesCountry &&
            matchesCity && matchesProducts && matchesDateRange;
    });

    // Apply sorting
    filteredSuppliers.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle different data types
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        } else if (typeof aVal === 'number') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }

        if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    displaySuppliers(filteredSuppliers);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterSuppliers();
}

function clearFilters() {
    // Clear all filter inputs
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('countryFilter').value = '';
    document.getElementById('cityFilter').value = '';
    document.getElementById('hasProductsFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('sortBy').value = 'supplier_name';
    document.getElementById('sortOrder').value = 'asc';

    // Reset and display all suppliers
    displaySuppliers(currentSuppliers);
}

function exportSuppliers() {
    const suppliers = currentSuppliers;
    if (suppliers.length === 0) {
        alert('No suppliers to export.');
        return;
    }

    // Prepare CSV data
    const headers = ['Name', 'Contact Person', 'Email', 'Phone', 'Address', 'City', 'Country', 'Status', 'Products Count', 'Website'];
    const csvData = [headers];

    suppliers.forEach(supplier => {
        const products = StockWiseDB.db.find('products', { supplier_id: supplier.id });
        csvData.push([
            supplier.supplier_name || '',
            supplier.contact_person || '',
            supplier.email || '',
            supplier.phone || '',
            supplier.address || '',
            supplier.city || '',
            supplier.country || '',
            supplier.status || '',
            products.length,
            supplier.website || ''
        ]);
    });

    // Convert to CSV string
    const csvString = csvData.map(row =>
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Download CSV
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `suppliers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    // Log activity
    StockWiseDB.activity.log('suppliers_exported', `Exported ${suppliers.length} suppliers to CSV`);
}

function sortTable(column) {
    const direction = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    sortDirection[column] = direction;

    currentSuppliers.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    displaySuppliers(currentSuppliers);
}

function openAddSupplierModal() {
    currentEditingId = null;
    document.getElementById('supplierModalTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add Supplier';
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
    document.getElementById('status').value = 'active';
}

function editSupplier(id) {
    const supplier = StockWiseDB.db.getById('suppliers', id);
    if (!supplier) return;

    currentEditingId = id;
    document.getElementById('supplierModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Supplier';

    // Fill form with supplier data
    document.getElementById('supplierId').value = supplier.id;
    document.getElementById('supplierName').value = supplier.supplier_name;
    document.getElementById('contactPerson').value = supplier.contact_person;
    document.getElementById('email').value = supplier.email;
    document.getElementById('phone').value = supplier.phone;
    document.getElementById('address').value = supplier.address;
    document.getElementById('website').value = supplier.website || '';
    document.getElementById('status').value = supplier.status;
    document.getElementById('notes').value = supplier.notes || '';

    // Show modal
    new bootstrap.Modal(document.getElementById('supplierModal')).show();
}

function viewSupplier(id) {
    const supplier = StockWiseDB.db.getById('suppliers', id);
    if (!supplier) return;

    const products = StockWiseDB.db.find('products', { supplier_id: supplier.id });
    const statusClass = supplier.status === 'active' ? 'bg-success' : 'bg-secondary';

    const modalContent = `
                <div class="row g-3">
                    <div class="col-md-6"><strong>Supplier Name:</strong><br>${supplier.supplier_name}</div>
                    <div class="col-md-6"><strong>Contact Person:</strong><br>${supplier.contact_person}</div>
                    <div class="col-md-6"><strong>Email:</strong><br><a href="mailto:${supplier.email}">${supplier.email}</a></div>
                    <div class="col-md-6"><strong>Phone:</strong><br><a href="tel:${supplier.phone}">${supplier.phone}</a></div>
                    <div class="col-12"><strong>Address:</strong><br>${supplier.address}</div>
                    ${supplier.website ? `<div class="col-md-6"><strong>Website:</strong><br><a href="${supplier.website}" target="_blank">${supplier.website}</a></div>` : ''}
                    <div class="col-md-6"><strong>Status:</strong><br><span class="badge ${statusClass}">${supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}</span></div>
                    <div class="col-md-6"><strong>Products Count:</strong><br><span class="badge bg-info">${products.length} products</span></div>
                    ${supplier.notes ? `<div class="col-12"><strong>Notes:</strong><br>${supplier.notes}</div>` : ''}
                    <div class="col-md-6"><strong>Created:</strong><br>${new Date(supplier.created_at).toLocaleDateString()}</div>
                    <div class="col-md-6"><strong>Last Updated:</strong><br>${supplier.updated_at ? new Date(supplier.updated_at).toLocaleDateString() : 'Never'}</div>
                </div>
            `;

    // Create and show view modal
    const viewModal = document.createElement('div');
    viewModal.className = 'modal fade';
    viewModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-dark text-white">
                            <h5 class="modal-title"><i class="fas fa-eye me-2"></i>Supplier Details</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${modalContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" onclick="viewSupplierProducts('${id}')" data-bs-dismiss="modal">
                                <i class="fas fa-boxes me-2"></i>View Products
                            </button>
                            <button type="button" class="btn btn-primary" onclick="editSupplier('${id}')" data-bs-dismiss="modal">
                                <i class="fas fa-edit me-2"></i>Edit Supplier
                            </button>
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

function viewSupplierProducts(id) {
    const supplier = StockWiseDB.db.getById('suppliers', id);
    const products = StockWiseDB.db.find('products', { supplier_id: id });

    if (!supplier) return;

    let productsContent = '';
    if (products.length === 0) {
        productsContent = '<p class="text-muted">No products assigned to this supplier.</p>';
    } else {
        productsContent = `
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Code</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(product => `
                                    <tr>
                                        <td>${product.product_name}</td>
                                        <td><code>${product.product_code}</code></td>
                                        <td><span class="badge bg-secondary">${product.category}</span></td>
                                        <td>₹${parseFloat(product.unit_price).toFixed(2)}</td>
                                        <td>${product.current_stock} ${product.unit}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
    }

    // Create and show products modal
    const productsModal = document.createElement('div');
    productsModal.className = 'modal fade';
    productsModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-dark text-white">
                            <h5 class="modal-title"><i class="fas fa-boxes me-2"></i>Products by ${supplier.supplier_name}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${productsContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="window.location.href='products.html'" data-bs-dismiss="modal">
                                <i class="fas fa-plus me-2"></i>Manage Products
                            </button>
                        </div>
                    </div>
                </div>
            `;

    document.body.appendChild(productsModal);
    const modal = new bootstrap.Modal(productsModal);
    modal.show();

    // Remove modal from DOM when hidden
    productsModal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(productsModal);
    });
}

function saveSupplier() {
    const form = document.getElementById('supplierForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const supplierData = {
        supplier_name: document.getElementById('supplierName').value.trim(),
        contact_person: document.getElementById('contactPerson').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        website: document.getElementById('website').value.trim(),
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value.trim()
    };

    try {
        if (currentEditingId) {
            // Update existing supplier
            StockWiseDB.db.update('suppliers', currentEditingId, supplierData);
            showAlert('Supplier updated successfully!', 'success');
        } else {
            // Add new supplier
            StockWiseDB.db.insert('suppliers', supplierData);
            showAlert('Supplier added successfully!', 'success');
        }

        // Close modal and refresh data
        bootstrap.Modal.getInstance(document.getElementById('supplierModal')).hide();
        loadSuppliers();

    } catch (error) {
        console.error('Error saving supplier:', error);
        showAlert('Error saving supplier. Please try again.', 'danger');
    }
}

function deleteSupplier(id) {
    const supplier = StockWiseDB.db.getById('suppliers', id);
    const products = StockWiseDB.db.find('products', { supplier_id: id });

    if (!supplier) return;

    let confirmMessage = `Are you sure you want to delete "${supplier.supplier_name}"?`;
    if (products.length > 0) {
        confirmMessage += `\n\nThis supplier has ${products.length} product(s) assigned. These products will be unassigned from the supplier.`;
    }
    confirmMessage += '\n\nThis action cannot be undone.';

    if (confirm(confirmMessage)) {
        try {
            // Unassign products from this supplier
            products.forEach(product => {
                StockWiseDB.db.update('products', product.id, { supplier_id: null });
            });

            // Delete supplier
            StockWiseDB.db.delete('suppliers', id);
            showAlert('Supplier deleted successfully!', 'success');
            loadSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            showAlert('Error deleting supplier. Please try again.', 'danger');
        }
    }
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
