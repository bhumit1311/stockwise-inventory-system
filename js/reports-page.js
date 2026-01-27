/**
 * StockWise - reports Page JavaScript
 * Handles all functionality for the reports page
 */
// Check authentication on page load
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthentication();
            loadSummaryStats();
            setupEventListeners();
        });

        function checkAuthentication() {
            const user = StockWiseDB.getCurrentUser();
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            document.getElementById('currentUsername').textContent = user.username;
            document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function loadSummaryStats() {
            const products = StockWiseDB.db.getAll('products');
            const suppliers = StockWiseDB.db.getAll('suppliers');

            // Total products
            document.getElementById('totalProductsReport').textContent = products.length;

            // Total inventory value
            const totalValue = products.reduce((sum, p) => sum + (p.unit_price * p.current_stock), 0);
            document.getElementById('totalValue').textContent = 'â‚¹' + totalValue.toLocaleString('en-IN');

            // Low stock count
            const lowStock = products.filter(p => p.current_stock <= p.minimum_stock);
            document.getElementById('lowStockCount').textContent = lowStock.length;

            // Active suppliers
            const activeSuppliers = suppliers.filter(s => s.status === 'active');
            document.getElementById('totalSuppliers').textContent = activeSuppliers.length;
        }

        function showReport(type) {
            const reportTitle = document.getElementById('reportTitle');
            const reportContent = document.getElementById('reportContent');

            switch(type) {
                case 'inventory':
                    reportTitle.innerHTML = '<i class="fas fa-boxes me-2"></i>Inventory Report';
                    reportContent.innerHTML = generateInventoryReport();
                    break;
                case 'supplier':
                    reportTitle.innerHTML = '<i class="fas fa-truck me-2"></i>Supplier Report';
                    reportContent.innerHTML = generateSupplierReport();
                    break;
                case 'lowstock':
                    reportTitle.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Low Stock Report';
                    reportContent.innerHTML = generateLowStockReport();
                    break;
                case 'movement':
                    reportTitle.innerHTML = '<i class="fas fa-exchange-alt me-2"></i>Stock Movement Report';
                    reportContent.innerHTML = generateMovementReport();
                    break;
            }
        }

        function generateInventoryReport() {
            const products = StockWiseDB.db.getAll('products');
            
            if (products.length === 0) {
                return '<div class="alert alert-info">No products found in inventory.</div>';
            }

            let html = '<div class="table-responsive"><table class="table table-hover">';
            html += '<thead><tr>';
            html += '<th>Product Code</th>';
            html += '<th>Product Name</th>';
            html += '<th>Category</th>';
            html += '<th>Unit Price</th>';
            html += '<th>Current Stock</th>';
            html += '<th>Stock Value</th>';
            html += '<th>Status</th>';
            html += '</tr></thead><tbody>';

            products.forEach(product => {
                const stockValue = product.unit_price * product.current_stock;
                const status = product.current_stock <= product.minimum_stock ? 
                    '<span class="badge bg-danger">Low Stock</span>' : 
                    '<span class="badge bg-success">Good</span>';

                html += `<tr>
                    <td>${product.product_code}</td>
                    <td>${product.product_name}</td>
                    <td>${product.category}</td>
                    <td>â‚¹${product.unit_price.toLocaleString('en-IN')}</td>
                    <td>${product.current_stock} ${product.unit}</td>
                    <td>â‚¹${stockValue.toLocaleString('en-IN')}</td>
                    <td>${status}</td>
                </tr>`;
            });

            html += '</tbody></table></div>';
            return html;
        }

        function generateSupplierReport() {
            const suppliers = StockWiseDB.db.getAll('suppliers');
            const products = StockWiseDB.db.getAll('products');

            if (suppliers.length === 0) {
                return '<div class="alert alert-info">No suppliers found.</div>';
            }

            let html = '<div class="table-responsive"><table class="table table-hover">';
            html += '<thead><tr>';
            html += '<th>Supplier Name</th>';
            html += '<th>Contact Person</th>';
            html += '<th>Email</th>';
            html += '<th>Phone</th>';
            html += '<th>Products Supplied</th>';
            html += '<th>Status</th>';
            html += '</tr></thead><tbody>';

            suppliers.forEach(supplier => {
                const supplierProducts = products.filter(p => p.supplier_id === supplier.id);
                const statusBadge = supplier.status === 'active' ? 
                    '<span class="badge bg-success">Active</span>' : 
                    '<span class="badge bg-secondary">Inactive</span>';

                html += `<tr>
                    <td>${supplier.supplier_name}</td>
                    <td>${supplier.contact_person}</td>
                    <td>${supplier.email}</td>
                    <td>${supplier.phone}</td>
                    <td>${supplierProducts.length} products</td>
                    <td>${statusBadge}</td>
                </tr>`;
            });

            html += '</tbody></table></div>';
            return html;
        }

        function generateLowStockReport() {
            const products = StockWiseDB.db.getAll('products');
            const lowStockProducts = products.filter(p => p.current_stock <= p.minimum_stock);

            if (lowStockProducts.length === 0) {
                return '<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>All products are well stocked!</div>';
            }

            let html = '<div class="alert alert-warning mb-3">';
            html += `<i class="fas fa-exclamation-triangle me-2"></i>`;
            html += `<strong>${lowStockProducts.length}</strong> product(s) need restocking`;
            html += '</div>';

            html += '<div class="table-responsive"><table class="table table-hover">';
            html += '<thead><tr>';
            html += '<th>Product Code</th>';
            html += '<th>Product Name</th>';
            html += '<th>Current Stock</th>';
            html += '<th>Minimum Stock</th>';
            html += '<th>Shortage</th>';
            html += '<th>Action Required</th>';
            html += '</tr></thead><tbody>';

            lowStockProducts.forEach(product => {
                const shortage = product.minimum_stock - product.current_stock;
                const urgency = shortage > 10 ? 'Urgent' : 'Normal';
                const urgencyClass = shortage > 10 ? 'danger' : 'warning';

                html += `<tr>
                    <td>${product.product_code}</td>
                    <td>${product.product_name}</td>
                    <td><span class="badge bg-danger">${product.current_stock}</span></td>
                    <td>${product.minimum_stock}</td>
                    <td>${shortage}</td>
                    <td><span class="badge bg-${urgencyClass}">${urgency}</span></td>
                </tr>`;
            });

            html += '</tbody></table></div>';
            return html;
        }

        function generateMovementReport() {
            const stockLogs = StockWiseDB.db.getAll('stock_logs');
            const products = StockWiseDB.db.getAll('products');

            if (stockLogs.length === 0) {
                return '<div class="alert alert-info">No stock movements recorded.</div>';
            }

            let html = '<div class="table-responsive"><table class="table table-hover">';
            html += '<thead><tr>';
            html += '<th>Date</th>';
            html += '<th>Product</th>';
            html += '<th>Type</th>';
            html += '<th>Quantity</th>';
            html += '<th>Reference</th>';
            html += '<th>Notes</th>';
            html += '</tr></thead><tbody>';

            stockLogs.slice(0, 50).forEach(log => {
                const product = products.find(p => p.id === log.product_id);
                const typeClass = log.movement_type === 'IN' ? 'success' : 'danger';
                const typeIcon = log.movement_type === 'IN' ? 'arrow-down' : 'arrow-up';

                html += `<tr>
                    <td>${new Date(log.created_at).toLocaleDateString()}</td>
                    <td>${product ? product.product_name : 'Unknown'}</td>
                    <td><span class="badge bg-${typeClass}"><i class="fas fa-${typeIcon} me-1"></i>${log.movement_type}</span></td>
                    <td>${log.quantity}</td>
                    <td>${log.reference || 'N/A'}</td>
                    <td>${log.notes || '-'}</td>
                </tr>`;
            });

            html += '</tbody></table></div>';
            return html;
        }

// Initialize Charts
        function initializeCharts() {
            const products = StockWiseDB.db.getAll('products');
            
            // Group products by category
            const categoryData = {};
            const categoryValue = {};
            
            products.forEach(product => {
                if (!categoryData[product.category]) {
                    categoryData[product.category] = 0;
                    categoryValue[product.category] = 0;
                }
                categoryData[product.category] += product.current_stock;
                categoryValue[product.category] += product.unit_price * product.current_stock;
            });

            // Category Chart (Pie)
            const ctxCategory = document.getElementById('categoryChart');
            if (ctxCategory) {
                new Chart(ctxCategory, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(categoryData),
                        datasets: [{
                            data: Object.values(categoryData),
                            backgroundColor: [
                                '#3b82f6',
                                '#10b981',
                                '#f59e0b',
                                '#ef4444',
                                '#8b5cf6',
                                '#06b6d4'
                            ],
                            borderColor: '#1a1a1a',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    color: '#d1d5db',
                                    padding: 15,
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: false
                            }
                        }
                    }
                });
            }

            // Value Chart (Bar)
            const ctxValue = document.getElementById('valueChart');
            if (ctxValue) {
                new Chart(ctxValue, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(categoryValue),
                        datasets: [{
                            label: 'Stock Value (â‚¹)',
                            data: Object.values(categoryValue),
                            backgroundColor: '#3b82f6',
                            borderColor: '#2563eb',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#d1d5db',
                                    callback: function(value) {
                                        return 'â‚¹' + value.toLocaleString('en-IN');
                                    }
                                },
                                grid: {
                                    color: '#2a2a2a'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#d1d5db'
                                },
                                grid: {
                                    color: '#2a2a2a'
                                }
                            }
                        }
                    }
                });
            }
        }

        // Call initializeCharts after loading summary stats
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthentication();
            loadSummaryStats();
            initializeCharts();
            setupEventListeners();
        });
        function printReport() {
            window.print();
        }

        function exportReport() {
            alert('Export functionality will be implemented soon!');
        }

        function setupEventListeners() {
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    StockWiseDB.logoutUser();
                    window.location.href = '../index.html';
                }
            });
        }
