/**
 * StockWise - products Page JavaScript
 * Handles all functionality for the products page
 */
let currentProducts = [];
        let sortDirection = {};
        let currentEditingId = null;

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthentication();
            loadCategories();
            loadSuppliers();
            loadProducts();
            setupEventListeners();
        });

        function checkAuthentication() {
            const user = StockWiseDB.getCurrentUser();
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            document.getElementById('currentUsername').textContent = user.username;
            
            // Show admin-only navigation items
            if (user.role === 'admin') {
                document.getElementById('usersNavItem').style.display = 'block';
                document.getElementById('reportsNavItem').style.display = 'block';
            }
        }

        function goToDashboard() {
            const user = StockWiseDB.getCurrentUser();
            if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }

        function setupEventListeners() {
            // Search input
            document.getElementById('searchInput').addEventListener('input', filterProducts);
            
            // Filter dropdowns
            document.getElementById('categoryFilter').addEventListener('change', filterProducts);
            document.getElementById('stockFilter').addEventListener('change', filterProducts);
            document.getElementById('supplierFilter').addEventListener('change', filterProducts);
            document.getElementById('unitFilter').addEventListener('change', filterProducts);
            document.getElementById('sortBy').addEventListener('change', filterProducts);
            document.getElementById('sortOrder').addEventListener('change', filterProducts);
            
            // Advanced filter inputs
            document.getElementById('minPrice').addEventListener('input', debounce(filterProducts, 500));
            document.getElementById('maxPrice').addEventListener('input', debounce(filterProducts, 500));
            document.getElementById('minStock').addEventListener('input', debounce(filterProducts, 500));
            document.getElementById('maxStock').addEventListener('input', debounce(filterProducts, 500));
            
            // Logout button
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    StockWiseDB.logoutUser();
                    window.location.href = '../index.html';
                }
            });
        }

        // Debounce function to limit API calls
        function debounce(func, wait) {
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

        function loadCategories() {
            const categories = StockWiseDB.db.getAll('categories');
            const categorySelect = document.getElementById('category');
            const categoryFilter = document.getElementById('categoryFilter');
            
            // Clear existing options
            categorySelect.innerHTML = '<option value="">Select Category</option>';
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            
            categories.forEach(category => {
                categorySelect.innerHTML += `<option value="${category.name}">${category.name}</option>`;
                categoryFilter.innerHTML += `<option value="${category.name}">${category.name}</option>`;
            });
        }

        function loadSuppliers() {
            const suppliers = StockWiseDB.db.getAll('suppliers');
            const supplierSelect = document.getElementById('supplier');
            const supplierFilter = document.getElementById('supplierFilter');
            
            supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
            supplierFilter.innerHTML = '<option value="">All Suppliers</option>';
            
            suppliers.forEach(supplier => {
                supplierSelect.innerHTML += `<option value="${supplier.id}">${supplier.supplier_name}</option>`;
                supplierFilter.innerHTML += `<option value="${supplier.id}">${supplier.supplier_name}</option>`;
            });
        }

        function loadProducts() {
            currentProducts = StockWiseDB.db.getAll('products');
            displayProducts(currentProducts);
        }

        function displayProducts(products) {
            const tbody = document.getElementById('productsTableBody');
            const productCount = document.getElementById('productCount');
            
            productCount.textContent = products.length;
            
            if (products.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center py-4">
                            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No products found</p>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = products.map(product => {
                const supplier = StockWiseDB.db.getById('suppliers', product.supplier_id);
                const stockStatus = getStockStatus(product);
                
                return `
                    <tr>
                        <td>
                            <strong>${product.product_name}</strong>
                            ${product.description ? `<br><small class="text-muted">${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</small>` : ''}
                        </td>
                        <td><code>${product.product_code}</code></td>
                        <td><span class="badge bg-secondary">${product.category}</span></td>
                        <td><strong>â‚¹${parseFloat(product.unit_price).toFixed(2)}</strong></td>
                        <td>
                            <span class="badge ${stockStatus.class}">${product.current_stock} ${product.unit}</span>
                            <br><small class="text-muted">Min: ${product.minimum_stock}</small>
                        </td>
                        <td><span class="badge ${stockStatus.class}">${stockStatus.text}</span></td>
                        <td>${supplier ? supplier.supplier_name : '<span class="text-muted">No supplier</span>'}</td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="editProduct('${product.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-info" onclick="viewProduct('${product.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-danger" onclick="deleteProduct('${product.id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
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

        function filterProducts() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            const stockFilter = document.getElementById('stockFilter').value;
            const supplierFilter = document.getElementById('supplierFilter').value;
            const unitFilter = document.getElementById('unitFilter').value;
            const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
            const minStock = parseInt(document.getElementById('minStock').value) || 0;
            const maxStock = parseInt(document.getElementById('maxStock').value) || Infinity;
            const sortBy = document.getElementById('sortBy').value;
            const sortOrder = document.getElementById('sortOrder').value;
            
            let filteredProducts = currentProducts.filter(product => {
                // Search filter - check name, code, and description
                const matchesSearch = !searchTerm ||
                    product.product_name.toLowerCase().includes(searchTerm) ||
                    product.product_code.toLowerCase().includes(searchTerm) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm));
                
                // Category filter
                const matchesCategory = !categoryFilter || product.category === categoryFilter;
                
                // Stock status filter
                let matchesStock = true;
                if (stockFilter) {
                    const stockStatus = getStockStatus(product);
                    matchesStock = stockStatus.text.toLowerCase().includes(stockFilter);
                }
                
                // Supplier filter
                const matchesSupplier = !supplierFilter || product.supplier_id === supplierFilter;
                
                // Unit filter
                const matchesUnit = !unitFilter || product.unit === unitFilter;
                
                // Price range filter
                const matchesPrice = product.unit_price >= minPrice && product.unit_price <= maxPrice;
                
                // Stock range filter
                const matchesStockRange = product.current_stock >= minStock && product.current_stock <= maxStock;
                
                return matchesSearch && matchesCategory && matchesStock &&
                       matchesSupplier && matchesUnit && matchesPrice && matchesStockRange;
            });
            
            // Apply sorting
            filteredProducts.sort((a, b) => {
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
            
            displayProducts(filteredProducts);
        }

        function clearSearch() {
            document.getElementById('searchInput').value = '';
            filterProducts();
        }

        function clearFilters() {
            // Clear all filter inputs
            document.getElementById('searchInput').value = '';
            document.getElementById('categoryFilter').value = '';
            document.getElementById('stockFilter').value = '';
            document.getElementById('supplierFilter').value = '';
            document.getElementById('unitFilter').value = '';
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            document.getElementById('minStock').value = '';
            document.getElementById('maxStock').value = '';
            document.getElementById('sortBy').value = 'product_name';
            document.getElementById('sortOrder').value = 'asc';
            
            // Reset and display all products
            displayProducts(currentProducts);
        }

        function exportProducts() {
            const products = currentProducts;
            if (products.length === 0) {
                alert('No products to export.');
                return;
            }

            // Prepare CSV data
            const headers = ['Name', 'Code', 'Category', 'Unit Price', 'Current Stock', 'Unit', 'Min Stock', 'Max Stock', 'Supplier', 'Status', 'Description'];
            const csvData = [headers];

            products.forEach(product => {
                const supplier = StockWiseDB.db.getById('suppliers', product.supplier_id);
                const stockStatus = getStockStatus(product);
                
                csvData.push([
                    product.product_name || '',
                    product.product_code || '',
                    product.category || '',
                    product.unit_price || 0,
                    product.current_stock || 0,
                    product.unit || '',
                    product.minimum_stock || 0,
                    product.maximum_stock || 0,
                    supplier ? supplier.supplier_name : '',
                    stockStatus.text || '',
                    product.description || ''
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
            link.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            // Log activity
            StockWiseDB.activity.log('products_exported', `Exported ${products.length} products to CSV`);
        }

        function sortTable(column) {
            const direction = sortDirection[column] === 'asc' ? 'desc' : 'asc';
            sortDirection[column] = direction;
            
            currentProducts.sort((a, b) => {
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
            
            displayProducts(currentProducts);
        }

        function openAddProductModal() {
            currentEditingId = null;
            document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-plus me-2"></i>Add Product';
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
        }

        function editProduct(id) {
            const product = StockWiseDB.db.getById('products', id);
            if (!product) return;
            
            currentEditingId = id;
            document.getElementById('productModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit Product';
            
            // Fill form with product data
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.product_name;
            document.getElementById('productCode').value = product.product_code;
            document.getElementById('category').value = product.category;
            document.getElementById('supplier').value = product.supplier_id || '';
            document.getElementById('unitPrice').value = product.unit_price;
            document.getElementById('currentStock').value = product.current_stock;
            document.getElementById('unit').value = product.unit;
            document.getElementById('minimumStock').value = product.minimum_stock;
            document.getElementById('maximumStock').value = product.maximum_stock;
            document.getElementById('description').value = product.description || '';
            
            // Show modal
            new bootstrap.Modal(document.getElementById('productModal')).show();
        }

        function viewProduct(id) {
            const product = StockWiseDB.db.getById('products', id);
            if (!product) return;
            
            const supplier = StockWiseDB.db.getById('suppliers', product.supplier_id);
            const stockStatus = getStockStatus(product);
            
            const modalContent = `
                <div class="row g-3">
                    <div class="col-md-6"><strong>Product Name:</strong><br>${product.product_name}</div>
                    <div class="col-md-6"><strong>Product Code:</strong><br><code>${product.product_code}</code></div>
                    <div class="col-md-6"><strong>Category:</strong><br><span class="badge bg-secondary">${product.category}</span></div>
                    <div class="col-md-6"><strong>Unit Price:</strong><br>â‚¹${parseFloat(product.unit_price).toFixed(2)}</div>
                    <div class="col-md-6"><strong>Current Stock:</strong><br><span class="badge ${stockStatus.class}">${product.current_stock} ${product.unit}</span></div>
                    <div class="col-md-6"><strong>Stock Status:</strong><br><span class="badge ${stockStatus.class}">${stockStatus.text}</span></div>
                    <div class="col-md-6"><strong>Minimum Stock:</strong><br>${product.minimum_stock} ${product.unit}</div>
                    <div class="col-md-6"><strong>Maximum Stock:</strong><br>${product.maximum_stock} ${product.unit}</div>
                    <div class="col-12"><strong>Supplier:</strong><br>${supplier ? supplier.supplier_name : 'No supplier assigned'}</div>
                    ${product.description ? `<div class="col-12"><strong>Description:</strong><br>${product.description}</div>` : ''}
                    <div class="col-md-6"><strong>Created:</strong><br>${new Date(product.created_at).toLocaleDateString()}</div>
                    <div class="col-md-6"><strong>Last Updated:</strong><br>${product.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'Never'}</div>
                </div>
            `;
            
            // Create and show view modal
            const viewModal = document.createElement('div');
            viewModal.className = 'modal fade';
            viewModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-dark text-white">
                            <h5 class="modal-title"><i class="fas fa-eye me-2"></i>Product Details</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${modalContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="editProduct('${id}')" data-bs-dismiss="modal">
                                <i class="fas fa-edit me-2"></i>Edit Product
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

        function saveProduct() {
            const form = document.getElementById('productForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const productData = {
                product_name: document.getElementById('productName').value.trim(),
                product_code: document.getElementById('productCode').value.trim(),
                category: document.getElementById('category').value,
                supplier_id: document.getElementById('supplier').value || null,
                unit_price: parseFloat(document.getElementById('unitPrice').value),
                current_stock: parseInt(document.getElementById('currentStock').value),
                unit: document.getElementById('unit').value,
                minimum_stock: parseInt(document.getElementById('minimumStock').value) || 5,
                maximum_stock: parseInt(document.getElementById('maximumStock').value) || 100,
                description: document.getElementById('description').value.trim(),
                status: 'active'
            };
            
            try {
                if (currentEditingId) {
                    // Update existing product
                    StockWiseDB.db.update('products', currentEditingId, productData);
                    showAlert('Product updated successfully!', 'success');
                } else {
                    // Add new product
                    StockWiseDB.db.insert('products', productData);
                    showAlert('Product added successfully!', 'success');
                }
                
                // Close modal and refresh data
                bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
                loadProducts();
                
            } catch (error) {
                console.error('Error saving product:', error);
                showAlert('Error saving product. Please try again.', 'danger');
            }
        }

        function deleteProduct(id) {
            const product = StockWiseDB.db.getById('products', id);
            if (!product) return;
            
            if (confirm(`Are you sure you want to delete "${product.product_name}"? This action cannot be undone.`)) {
                try {
                    StockWiseDB.db.delete('products', id);
                    showAlert('Product deleted successfully!', 'success');
                    loadProducts();
                } catch (error) {
                    console.error('Error deleting product:', error);
                    showAlert('Error deleting product. Please try again.', 'danger');
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
