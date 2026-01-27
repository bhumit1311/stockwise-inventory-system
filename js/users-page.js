/**
 * StockWise - users Page JavaScript
 * Handles all functionality for the users page
 */
let currentUsers = [];
        let sortDirection = {};
        let currentEditingId = null;

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthentication();
            loadUsers();
            loadStatistics();
            setupEventListeners();
        });

        function checkAuthentication() {
            const user = StockWiseDB.getCurrentUser();
            if (!user) {
                window.location.href = 'login.html';
                return;
            }

            // Only admins can access this page
            if (user.role !== 'admin') {
                alert('Access denied. Administrator privileges required.');
                window.location.href = 'user-dashboard.html';
                return;
            }

            document.getElementById('currentUsername').textContent = user.username;
        }

        function setupEventListeners() {
            // Search input
            document.getElementById('searchInput').addEventListener('input', filterUsers);
            
            // Filter dropdowns
            document.getElementById('roleFilter').addEventListener('change', filterUsers);
            document.getElementById('statusFilter').addEventListener('change', filterUsers);
            
            // Logout button
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    StockWiseDB.logoutUser();
                    window.location.href = '../index.html';
                }
            });
        }

        function loadUsers() {
            currentUsers = StockWiseDB.db.getAll('users');
            displayUsers(currentUsers);
        }

        function loadStatistics() {
            const users = StockWiseDB.db.getAll('users');
            const activityLogs = StockWiseDB.db.getAll('activity_logs');
            
            // Calculate statistics
            const totalUsers = users.length;
            const adminUsers = users.filter(u => u.role === 'admin').length;
            const activeUsers = users.filter(u => u.status === 'active').length;
            
            // Recent logins (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentLogins = activityLogs.filter(log => 
                log.action === 'LOGIN' && new Date(log.timestamp) > sevenDaysAgo
            ).length;
            
            // Update statistics display
            document.getElementById('totalUsers').textContent = totalUsers;
            document.getElementById('adminUsers').textContent = adminUsers;
            document.getElementById('activeUsers').textContent = activeUsers;
            document.getElementById('recentLogins').textContent = recentLogins;
        }

        function displayUsers(users) {
            const tbody = document.getElementById('usersTableBody');
            const userCount = document.getElementById('userCount');
            
            userCount.textContent = users.length;
            
            if (users.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            <i class="fas fa-users fa-3x text-muted mb-3"></i>
                            <p class="text-muted">No users found</p>
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = users.map(user => {
                const roleClass = getRoleClass(user.role);
                const statusClass = user.status === 'active' ? 'bg-success' : 'bg-secondary';
                const lastLogin = user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never';
                
                return `
                    <tr>
                        <td>
                            <strong>${user.full_name}</strong>
                        </td>
                        <td>
                            <code>${user.username}</code>
                        </td>
                        <td>
                            <a href="mailto:${user.email}">${user.email}</a>
                        </td>
                        <td>
                            <span class="badge ${roleClass}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                        </td>
                        <td>
                            <span class="badge ${statusClass}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span>
                        </td>
                        <td>
                            <small>${lastLogin}</small>
                        </td>
                        <td>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-outline-primary" onclick="editUser('${user.id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-info" onclick="viewUser('${user.id}')" title="View">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn btn-outline-warning" onclick="resetPassword('${user.id}')" title="Reset Password">
                                    <i class="fas fa-key"></i>
                                </button>
                                ${user.username !== StockWiseDB.getCurrentUser().username ? 
                                    `<button class="btn btn-outline-danger" onclick="deleteUser('${user.id}')" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>` : ''
                                }
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function getRoleClass(role) {
            switch (role) {
                case 'admin': return 'bg-danger';
                case 'staff': return 'bg-warning';
                case 'user': return 'bg-primary';
                default: return 'bg-secondary';
            }
        }

        function filterUsers() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const roleFilter = document.getElementById('roleFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            
            let filteredUsers = currentUsers.filter(user => {
                const matchesSearch = user.full_name.toLowerCase().includes(searchTerm) ||
                                    user.username.toLowerCase().includes(searchTerm) ||
                                    user.email.toLowerCase().includes(searchTerm);
                
                const matchesRole = !roleFilter || user.role === roleFilter;
                const matchesStatus = !statusFilter || user.status === statusFilter;
                
                return matchesSearch && matchesRole && matchesStatus;
            });
            
            displayUsers(filteredUsers);
        }

        function clearFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('roleFilter').value = '';
            document.getElementById('statusFilter').value = '';
            displayUsers(currentUsers);
        }

        function sortTable(column) {
            const direction = sortDirection[column] === 'asc' ? 'desc' : 'asc';
            sortDirection[column] = direction;
            
            currentUsers.sort((a, b) => {
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
            
            displayUsers(currentUsers);
        }

        function openAddUserModal() {
            currentEditingId = null;
            document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-user-plus me-2"></i>Add User';
            document.getElementById('userForm').reset();
            document.getElementById('userId').value = '';
            document.getElementById('status').value = 'active';
            document.getElementById('password').required = true;
            document.getElementById('passwordField').style.display = 'block';
            document.getElementById('editPasswordSection').style.display = 'none';
        }

        function editUser(id) {
            const user = StockWiseDB.db.getById('users', id);
            if (!user) return;
            
            currentEditingId = id;
            document.getElementById('userModalTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Edit User';
            
            // Fill form with user data
            document.getElementById('userId').value = user.id;
            document.getElementById('fullName').value = user.full_name;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            document.getElementById('role').value = user.role;
            document.getElementById('status').value = user.status;
            document.getElementById('password').value = '';
            document.getElementById('password').required = false;
            document.getElementById('editPasswordSection').style.display = 'block';
            
            // Show modal
            new bootstrap.Modal(document.getElementById('userModal')).show();
        }

        function viewUser(id) {
            const user = StockWiseDB.db.getById('users', id);
            if (!user) return;
            
            const activityLogs = StockWiseDB.db.find('activity_logs', { user_id: id }).slice(0, 10);
            const roleClass = getRoleClass(user.role);
            const statusClass = user.status === 'active' ? 'bg-success' : 'bg-secondary';
            
            let activityContent = '';
            if (activityLogs.length === 0) {
                activityContent = '<p class="text-muted">No recent activity.</p>';
            } else {
                activityContent = `
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Table</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${activityLogs.map(log => `
                                    <tr>
                                        <td><span class="badge bg-info">${log.action}</span></td>
                                        <td>${log.table_name}</td>
                                        <td><small>${new Date(log.timestamp).toLocaleString()}</small></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
            
            const modalContent = `
                <div class="row g-3">
                    <div class="col-md-6"><strong>Full Name:</strong><br>${user.full_name}</div>
                    <div class="col-md-6"><strong>Username:</strong><br><code>${user.username}</code></div>
                    <div class="col-md-6"><strong>Email:</strong><br><a href="mailto:${user.email}">${user.email}</a></div>
                    <div class="col-md-6"><strong>Role:</strong><br><span class="badge ${roleClass}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></div>
                    <div class="col-md-6"><strong>Status:</strong><br><span class="badge ${statusClass}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></div>
                    <div class="col-md-6"><strong>Last Login:</strong><br>${user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</div>
                    <div class="col-md-6"><strong>Created:</strong><br>${new Date(user.created_at).toLocaleDateString()}</div>
                    <div class="col-md-6"><strong>Last Updated:</strong><br>${user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}</div>
                    <div class="col-12"><hr></div>
                    <div class="col-12"><strong>Recent Activity:</strong></div>
                    <div class="col-12">${activityContent}</div>
                </div>
            `;
            
            // Create and show view modal
            const viewModal = document.createElement('div');
            viewModal.className = 'modal fade';
            viewModal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-gradient-dark text-white">
                            <h5 class="modal-title"><i class="fas fa-eye me-2"></i>User Details</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">${modalContent}</div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="editUser('${id}')" data-bs-dismiss="modal">
                                <i class="fas fa-edit me-2"></i>Edit User
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

        function saveUser() {
            const form = document.getElementById('userForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const userData = {
                full_name: document.getElementById('fullName').value.trim(),
                username: document.getElementById('username').value.trim(),
                email: document.getElementById('email').value.trim(),
                role: document.getElementById('role').value,
                status: document.getElementById('status').value
            };
            
            // Check if username already exists (for new users or different username)
            const existingUser = StockWiseDB.db.findOne('users', { username: userData.username });
            if (existingUser && existingUser.id !== currentEditingId) {
                showAlert('Username already exists. Please choose a different username.', 'danger');
                return;
            }
            
            // Check if email already exists (for new users or different email)
            const existingEmail = StockWiseDB.db.findOne('users', { email: userData.email });
            if (existingEmail && existingEmail.id !== currentEditingId) {
                showAlert('Email already exists. Please use a different email.', 'danger');
                return;
            }
            
            // Handle password
            const password = document.getElementById('password').value;
            if (password) {
                if (password.length < 6) {
                    showAlert('Password must be at least 6 characters long.', 'danger');
                    return;
                }
                userData.password = StockWiseDB.db.hashPassword(password);
            }
            
            try {
                if (currentEditingId) {
                    // Update existing user
                    StockWiseDB.db.update('users', currentEditingId, userData);
                    showAlert('User updated successfully!', 'success');
                } else {
                    // Add new user
                    if (!password) {
                        showAlert('Password is required for new users.', 'danger');
                        return;
                    }
                    StockWiseDB.db.insert('users', userData);
                    showAlert('User added successfully!', 'success');
                }
                
                // Close modal and refresh data
                bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
                loadUsers();
                loadStatistics();
                
            } catch (error) {
                console.error('Error saving user:', error);
                showAlert('Error saving user. Please try again.', 'danger');
            }
        }

        function resetPassword(id) {
            const user = StockWiseDB.db.getById('users', id);
            if (!user) return;
            
            const newPassword = prompt(`Enter new password for ${user.username}:`);
            if (!newPassword) return;
            
            if (newPassword.length < 6) {
                showAlert('Password must be at least 6 characters long.', 'danger');
                return;
            }
            
            if (confirm(`Are you sure you want to reset the password for ${user.username}?`)) {
                try {
                    StockWiseDB.db.update('users', id, { password: StockWiseDB.db.hashPassword(newPassword) });
                    showAlert('Password reset successfully!', 'success');
                } catch (error) {
                    console.error('Error resetting password:', error);
                    showAlert('Error resetting password. Please try again.', 'danger');
                }
            }
        }

        function deleteUser(id) {
            const user = StockWiseDB.db.getById('users', id);
            const currentUser = StockWiseDB.getCurrentUser();
            
            if (!user) return;
            
            // Prevent deleting own account
            if (user.id === currentUser.id) {
                showAlert('You cannot delete your own account.', 'warning');
                return;
            }
            
            if (confirm(`Are you sure you want to delete user "${user.full_name}"? This action cannot be undone.`)) {
                try {
                    StockWiseDB.db.delete('users', id);
                    showAlert('User deleted successfully!', 'success');
                    loadUsers();
                    loadStatistics();
                } catch (error) {
                    console.error('Error deleting user:', error);
                    showAlert('Error deleting user. Please try again.', 'danger');
                }
            }
        }

        function togglePassword() {
            const passwordField = document.getElementById('password');
            const toggleIcon = document.getElementById('passwordToggleIcon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
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
