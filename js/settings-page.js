/**
 * StockWise - settings Page JavaScript
 * Handles all functionality for the settings page
 */
let currentUser = null;

        document.addEventListener('DOMContentLoaded', function() {
            // Check authentication
            currentUser = StockWiseDB.auth.getCurrentUser();
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }

            // Update navigation based on user role
            updateNavigation();
            
            // Load current settings
            loadSettings();
        });

        function updateNavigation() {
            document.getElementById('currentUserName').textContent = currentUser.first_name + ' ' + currentUser.last_name;
            
            if (currentUser.role === 'admin') {
                document.getElementById('usersNavItem').style.display = 'block';
                document.getElementById('reportsNavItem').style.display = 'block';
            }
        }

        function goToDashboard() {
            if (currentUser.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }

        function loadSettings() {
            // Get settings from localStorage or use defaults
            const settings = JSON.parse(localStorage.getItem('stockwise_settings')) || getDefaultSettings();
            
            // General Settings
            document.getElementById('companyName').value = settings.general.companyName || '';
            document.getElementById('currency').value = settings.general.currency || 'USD';
            document.getElementById('dateFormat').value = settings.general.dateFormat || 'MM/DD/YYYY';
            document.getElementById('timezone').value = settings.general.timezone || 'UTC';
            document.getElementById('language').value = settings.general.language || 'en';
            
            // Inventory Settings
            document.getElementById('lowStockThreshold').value = settings.inventory.lowStockThreshold || 20;
            document.getElementById('autoReorderPoint').value = settings.inventory.autoReorderPoint || 10;
            document.getElementById('enableStockAlerts').checked = settings.inventory.enableStockAlerts !== false;
            document.getElementById('enableAutoReorder').checked = settings.inventory.enableAutoReorder !== false;
            document.getElementById('trackExpiryDates').checked = settings.inventory.trackExpiryDates !== false;
            
            // Notification Settings
            document.getElementById('emailNotifications').checked = settings.notifications.emailNotifications !== false;
            document.getElementById('browserNotifications').checked = settings.notifications.browserNotifications !== false;
            document.getElementById('lowStockNotifications').checked = settings.notifications.lowStockNotifications !== false;
            document.getElementById('expiryNotifications').checked = settings.notifications.expiryNotifications !== false;
            document.getElementById('systemUpdates').checked = settings.notifications.systemUpdates !== false;
            
            // Security Settings
            document.getElementById('sessionTimeout').value = settings.security.sessionTimeout || 60;
            document.getElementById('requirePasswordChange').checked = settings.security.requirePasswordChange !== false;
            document.getElementById('enableTwoFactor').checked = settings.security.enableTwoFactor === true;
            document.getElementById('logUserActivity').checked = settings.security.logUserActivity !== false;
        }

        function getDefaultSettings() {
            return {
                general: {
                    companyName: '',
                    currency: 'USD',
                    dateFormat: 'MM/DD/YYYY',
                    timezone: 'UTC',
                    language: 'en'
                },
                inventory: {
                    lowStockThreshold: 20,
                    autoReorderPoint: 10,
                    enableStockAlerts: true,
                    enableAutoReorder: true,
                    trackExpiryDates: true
                },
                notifications: {
                    emailNotifications: true,
                    browserNotifications: true,
                    lowStockNotifications: true,
                    expiryNotifications: true,
                    systemUpdates: true
                },
                security: {
                    sessionTimeout: 60,
                    requirePasswordChange: true,
                    enableTwoFactor: false,
                    logUserActivity: true
                }
            };
        }

        function saveAllSettings() {
            const settings = {
                general: {
                    companyName: document.getElementById('companyName').value,
                    currency: document.getElementById('currency').value,
                    dateFormat: document.getElementById('dateFormat').value,
                    timezone: document.getElementById('timezone').value,
                    language: document.getElementById('language').value
                },
                inventory: {
                    lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value),
                    autoReorderPoint: parseInt(document.getElementById('autoReorderPoint').value),
                    enableStockAlerts: document.getElementById('enableStockAlerts').checked,
                    enableAutoReorder: document.getElementById('enableAutoReorder').checked,
                    trackExpiryDates: document.getElementById('trackExpiryDates').checked
                },
                notifications: {
                    emailNotifications: document.getElementById('emailNotifications').checked,
                    browserNotifications: document.getElementById('browserNotifications').checked,
                    lowStockNotifications: document.getElementById('lowStockNotifications').checked,
                    expiryNotifications: document.getElementById('expiryNotifications').checked,
                    systemUpdates: document.getElementById('systemUpdates').checked
                },
                security: {
                    sessionTimeout: parseInt(document.getElementById('sessionTimeout').value),
                    requirePasswordChange: document.getElementById('requirePasswordChange').checked,
                    enableTwoFactor: document.getElementById('enableTwoFactor').checked,
                    logUserActivity: document.getElementById('logUserActivity').checked
                }
            };

            // Save to localStorage
            localStorage.setItem('stockwise_settings', JSON.stringify(settings));
            
            // Log activity
            StockWiseDB.activity.log('settings_updated', 'Application settings updated');
            
            // Show success message
            showAlert('Settings saved successfully!', 'success');
        }

        function resetToDefaults() {
            if (confirm('Are you sure you want to reset all settings to default values?')) {
                localStorage.removeItem('stockwise_settings');
                loadSettings();
                showAlert('Settings reset to default values.', 'info');
            }
        }

        function exportAllData() {
            const data = {
                products: StockWiseDB.db.getAll('products'),
                suppliers: StockWiseDB.db.getAll('suppliers'),
                users: StockWiseDB.db.getAll('users'),
                stock_movements: StockWiseDB.db.getAll('stock_movements'),
                activities: StockWiseDB.db.getAll('activities'),
                settings: JSON.parse(localStorage.getItem('stockwise_settings')) || getDefaultSettings(),
                export_date: new Date().toISOString(),
                version: '1.0'
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `stockwise_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            StockWiseDB.activity.log('data_exported', 'Complete database exported');
            showAlert('Data exported successfully!', 'success');
        }

        function showImportModal() {
            const modal = new bootstrap.Modal(document.getElementById('importModal'));
            modal.show();
        }

        function importData() {
            const fileInput = document.getElementById('importFile');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file to import.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!data.products || !data.suppliers || !data.users) {
                        throw new Error('Invalid data format');
                    }

                    // Import data
                    if (data.products) localStorage.setItem('stockwise_products', JSON.stringify(data.products));
                    if (data.suppliers) localStorage.setItem('stockwise_suppliers', JSON.stringify(data.suppliers));
                    if (data.users) localStorage.setItem('stockwise_users', JSON.stringify(data.users));
                    if (data.stock_movements) localStorage.setItem('stockwise_stock_movements', JSON.stringify(data.stock_movements));
                    if (data.activities) localStorage.setItem('stockwise_activities', JSON.stringify(data.activities));
                    if (data.settings) localStorage.setItem('stockwise_settings', JSON.stringify(data.settings));

                    // Close modal
                    bootstrap.Modal.getInstance(document.getElementById('importModal')).hide();
                    
                    // Log activity
                    StockWiseDB.activity.log('data_imported', 'Database imported from file');
                    
                    // Show success and reload
                    showAlert('Data imported successfully! Reloading page...', 'success');
                    setTimeout(() => location.reload(), 2000);
                    
                } catch (error) {
                    alert('Error importing data: ' + error.message);
                }
            };
            reader.readAsText(file);
        }

        function clearActivityLogs() {
            if (confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
                localStorage.removeItem('stockwise_activities');
                StockWiseDB.activity.log('logs_cleared', 'Activity logs cleared');
                showAlert('Activity logs cleared successfully.', 'info');
            }
        }

        function showResetModal() {
            const modal = new bootstrap.Modal(document.getElementById('resetModal'));
            modal.show();
        }

        function resetAllData() {
            const confirmation = document.getElementById('resetConfirmation').value;
            
            if (confirmation !== 'RESET') {
                alert('Please type RESET to confirm.');
                return;
            }

            if (confirm('This will permanently delete ALL data. Are you absolutely sure?')) {
                // Clear all data except current user session
                localStorage.removeItem('stockwise_products');
                localStorage.removeItem('stockwise_suppliers');
                localStorage.removeItem('stockwise_users');
                localStorage.removeItem('stockwise_stock_movements');
                localStorage.removeItem('stockwise_activities');
                localStorage.removeItem('stockwise_settings');
                
                // Close modal
                bootstrap.Modal.getInstance(document.getElementById('resetModal')).hide();
                
                // Show success and redirect to login
                alert('All data has been reset. You will be redirected to the login page.');
                logout();
            }
        }

        function showAlert(message, type) {
            // Remove existing alerts
            const existingAlert = document.querySelector('.alert-dismissible');
            if (existingAlert) {
                existingAlert.remove();
            }

            // Create new alert
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
            alertDiv.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

            // Insert at top of container
            const container = document.querySelector('.container');
            container.insertBefore(alertDiv, container.firstChild.nextSibling);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }

        function logout() {
            StockWiseDB.auth.logout();
            window.location.href = 'login.html';
        }
