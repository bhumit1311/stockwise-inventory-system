/**
 * StockWise Client-Side Database
 * This file replaces PHP database functionality with localStorage-based data management
 * Provides a simple API for CRUD operations without server dependency
 */

// ===== DATABASE CONFIGURATION =====
const DB_CONFIG = {
    version: '1.0.0',
    name: 'stockwise_db',
    tables: {
        users: 'stockwise_users',
        products: 'stockwise_products',
        suppliers: 'stockwise_suppliers',
        stock_logs: 'stockwise_stock_logs',
        activity_logs: 'stockwise_activity_logs',
        categories: 'stockwise_categories'
    }
};

// ===== DATABASE CLASS =====
class ClientDatabase {
    constructor() {
        this.initializeDatabase();
    }

    /**
     * Initialize database with default data if not exists
     */
    initializeDatabase() {
        // Initialize tables if they don't exist
        Object.values(DB_CONFIG.tables).forEach(table => {
            if (!localStorage.getItem(table)) {
                localStorage.setItem(table, JSON.stringify([]));
            }
        });

        // Initialize with sample data if database is empty
        this.initializeSampleData();
    }

    /**
     * Initialize sample data for demonstration
     */
    initializeSampleData() {
        // Initialize users if empty
        const users = this.getAll('users');
        if (users.length === 0) {
            const defaultUsers = [
                {
                    id: this.generateId(),
                    username: 'admin',
                    email: 'admin@stockwise.com',
                    password: this.hashPassword('password123'),
                    full_name: 'System Administrator',
                    role: 'admin',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    last_login: null
                },
                {
                    id: this.generateId(),
                    username: 'manager',
                    email: 'manager@stockwise.com',
                    password: this.hashPassword('password123'),
                    full_name: 'Store Manager',
                    role: 'user',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    last_login: null
                },
                {
                    id: this.generateId(),
                    username: 'staff',
                    email: 'staff@stockwise.com',
                    password: this.hashPassword('password123'),
                    full_name: 'Staff Member',
                    role: 'staff',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    last_login: null
                },
                {
                    id: this.generateId(),
                    username: 'user',
                    email: 'user@stockwise.com',
                    password: this.hashPassword('password123'),
                    full_name: 'Regular User',
                    role: 'user',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    last_login: null
                }
            ];
            
            localStorage.setItem(DB_CONFIG.tables.users, JSON.stringify(defaultUsers));
        }

        // Initialize categories if empty
        const categories = this.getAll('categories');
        if (categories.length === 0) {
            const defaultCategories = [
                { id: this.generateId(), name: 'Electronics', description: 'Electronic devices and components', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), name: 'Clothing', description: 'Apparel and fashion items', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), name: 'Books', description: 'Books and educational materials', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), name: 'Home & Garden', description: 'Home improvement and garden supplies', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), name: 'Sports', description: 'Sports equipment and accessories', status: 'active', created_at: new Date().toISOString() }
            ];
            
            localStorage.setItem(DB_CONFIG.tables.categories, JSON.stringify(defaultCategories));
        }

        // Initialize suppliers if empty
        const suppliers = this.getAll('suppliers');
        if (suppliers.length === 0) {
            const defaultSuppliers = [
                {
                    id: this.generateId(),
                    supplier_name: 'TechCorp Solutions',
                    contact_person: 'John Smith',
                    email: 'john@techcorp.com',
                    phone: '+91-9876543210',
                    address: '123 Tech Street, Mumbai, Maharashtra 400001',
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    supplier_name: 'Fashion Hub Ltd',
                    contact_person: 'Sarah Johnson',
                    email: 'sarah@fashionhub.com',
                    phone: '+91-9876543211',
                    address: '456 Fashion Avenue, Delhi, Delhi 110001',
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    supplier_name: 'BookWorld Publishers',
                    contact_person: 'Michael Brown',
                    email: 'michael@bookworld.com',
                    phone: '+91-9876543212',
                    address: '789 Knowledge Lane, Bangalore, Karnataka 560001',
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    supplier_name: 'Electronics Mart',
                    contact_person: 'David Lee',
                    email: 'david@electronicsmart.com',
                    phone: '+91-9876543213',
                    address: '321 Electronics Plaza, Pune, Maharashtra 411001',
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    supplier_name: 'Sports Equipment Co',
                    contact_person: 'Emma Wilson',
                    email: 'emma@sportsequip.com',
                    phone: '+91-9876543214',
                    address: '654 Sports Complex, Chennai, Tamil Nadu 600001',
                    status: 'active',
                    created_at: new Date().toISOString()
                },
                {
                    id: this.generateId(),
                    supplier_name: 'Home Decor Plus',
                    contact_person: 'Robert Taylor',
                    email: 'robert@homedecor.com',
                    phone: '+91-9876543215',
                    address: '987 Decor Street, Hyderabad, Telangana 500001',
                    status: 'active',
                    created_at: new Date().toISOString()
                }
            ];
            
            localStorage.setItem(DB_CONFIG.tables.suppliers, JSON.stringify(defaultSuppliers));
        }

        // Initialize products if empty
        const products = this.getAll('products');
        if (products.length === 0) {
            const categories_list = this.getAll('categories');
            const suppliers_list = this.getAll('suppliers');
            
            const defaultProducts = [
                // Electronics
                { id: this.generateId(), product_name: 'Laptop Dell Inspiron 15', product_code: 'ELEC-001', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 45000, current_stock: 25, minimum_stock: 5, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'HP Laptop ProBook 450', product_code: 'ELEC-002', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 52000, current_stock: 18, minimum_stock: 5, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Wireless Mouse Logitech', product_code: 'ELEC-003', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 1500, current_stock: 50, minimum_stock: 15, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Mechanical Keyboard RGB', product_code: 'ELEC-004', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 3500, current_stock: 8, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'USB-C Hub 7-in-1', product_code: 'ELEC-005', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 2200, current_stock: 35, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Webcam HD 1080p', product_code: 'ELEC-006', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 4500, current_stock: 22, minimum_stock: 8, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Wireless Headphones', product_code: 'ELEC-007', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 2800, current_stock: 6, minimum_stock: 12, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'External SSD 1TB', product_code: 'ELEC-008', category: categories_list[0]?.name || 'Electronics', supplier_id: suppliers_list[0]?.id, unit_price: 8500, current_stock: 15, minimum_stock: 5, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                
                // Clothing
                { id: this.generateId(), product_name: 'Cotton T-Shirt Blue', product_code: 'CLTH-001', category: categories_list[1]?.name || 'Clothing', supplier_id: suppliers_list[1]?.id, unit_price: 500, current_stock: 100, minimum_stock: 30, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Denim Jeans Regular Fit', product_code: 'CLTH-002', category: categories_list[1]?.name || 'Clothing', supplier_id: suppliers_list[1]?.id, unit_price: 1200, current_stock: 65, minimum_stock: 20, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Formal Shirt White', product_code: 'CLTH-003', category: categories_list[1]?.name || 'Clothing', supplier_id: suppliers_list[1]?.id, unit_price: 800, current_stock: 45, minimum_stock: 15, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Sports Shoes Running', product_code: 'CLTH-004', category: categories_list[1]?.name || 'Clothing', supplier_id: suppliers_list[1]?.id, unit_price: 2500, current_stock: 7, minimum_stock: 15, unit: 'pair', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Winter Jacket Black', product_code: 'CLTH-005', category: categories_list[1]?.name || 'Clothing', supplier_id: suppliers_list[1]?.id, unit_price: 3500, current_stock: 28, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                
                // Books
                { id: this.generateId(), product_name: 'JavaScript Complete Guide', product_code: 'BOOK-001', category: categories_list[2]?.name || 'Books', supplier_id: suppliers_list[2]?.id, unit_price: 800, current_stock: 30, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Python for Beginners', product_code: 'BOOK-002', category: categories_list[2]?.name || 'Books', supplier_id: suppliers_list[2]?.id, unit_price: 750, current_stock: 25, minimum_stock: 8, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Data Structures & Algorithms', product_code: 'BOOK-003', category: categories_list[2]?.name || 'Books', supplier_id: suppliers_list[2]?.id, unit_price: 950, current_stock: 18, minimum_stock: 8, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Web Development Handbook', product_code: 'BOOK-004', category: categories_list[2]?.name || 'Books', supplier_id: suppliers_list[2]?.id, unit_price: 850, current_stock: 22, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                
                // Home & Garden
                { id: this.generateId(), product_name: 'LED Desk Lamp', product_code: 'HOME-001', category: categories_list[3]?.name || 'Home & Garden', supplier_id: suppliers_list[0]?.id, unit_price: 1200, current_stock: 40, minimum_stock: 15, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Office Chair Ergonomic', product_code: 'HOME-002', category: categories_list[3]?.name || 'Home & Garden', supplier_id: suppliers_list[0]?.id, unit_price: 8500, current_stock: 12, minimum_stock: 5, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Standing Desk Adjustable', product_code: 'HOME-003', category: categories_list[3]?.name || 'Home & Garden', supplier_id: suppliers_list[0]?.id, unit_price: 15000, current_stock: 8, minimum_stock: 3, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Wall Clock Digital', product_code: 'HOME-004', category: categories_list[3]?.name || 'Home & Garden', supplier_id: suppliers_list[0]?.id, unit_price: 1500, current_stock: 25, minimum_stock: 10, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                
                // Sports
                { id: this.generateId(), product_name: 'Yoga Mat Premium', product_code: 'SPRT-001', category: categories_list[4]?.name || 'Sports', supplier_id: suppliers_list[1]?.id, unit_price: 1200, current_stock: 35, minimum_stock: 15, unit: 'piece', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Dumbbell Set 20kg', product_code: 'SPRT-002', category: categories_list[4]?.name || 'Sports', supplier_id: suppliers_list[1]?.id, unit_price: 3500, current_stock: 5, minimum_stock: 8, unit: 'set', status: 'active', created_at: new Date().toISOString() },
                { id: this.generateId(), product_name: 'Resistance Bands Set', product_code: 'SPRT-003', category: categories_list[4]?.name || 'Sports', supplier_id: suppliers_list[1]?.id, unit_price: 800, current_stock: 42, minimum_stock: 20, unit: 'set', status: 'active', created_at: new Date().toISOString() }
            ];
            
            localStorage.setItem(DB_CONFIG.tables.products, JSON.stringify(defaultProducts));
        }

        // Initialize stock logs if empty
        const stockLogs = this.getAll('stock_logs');
        if (stockLogs.length === 0) {
            const products_list = this.getAll('products');
            
            const users_list = this.getAll('users');
            const adminUser = users_list.find(u => u.role === 'admin');
            const staffUser = users_list.find(u => u.role === 'staff');
            const managerUser = users_list.find(u => u.role === 'user' && u.username === 'manager');
            
            const defaultStockLogs = [
                // Recent stock movements
                { id: this.generateId(), product_id: products_list[0]?.id, transaction_type: 'in', quantity: 10, previous_stock: 15, new_stock: 25, reference: 'PO-2026-001', reason: 'purchase', notes: 'New stock arrival from supplier', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[1]?.id, transaction_type: 'in', quantity: 8, previous_stock: 10, new_stock: 18, reference: 'PO-2026-002', reason: 'purchase', notes: 'Restocking HP laptops', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[2]?.id, transaction_type: 'out', quantity: 15, previous_stock: 65, new_stock: 50, reference: 'SO-2026-001', reason: 'sale', notes: 'Sold to corporate client', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[3]?.id, transaction_type: 'out', quantity: 5, previous_stock: 13, new_stock: 8, reference: 'SO-2026-002', reason: 'sale', notes: 'Office supply order', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[4]?.id, transaction_type: 'in', quantity: 20, previous_stock: 15, new_stock: 35, reference: 'PO-2026-003', reason: 'purchase', notes: 'Bulk order received', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user_id: managerUser?.id },
                { id: this.generateId(), product_id: products_list[5]?.id, transaction_type: 'in', quantity: 12, previous_stock: 10, new_stock: 22, reference: 'PO-2026-004', reason: 'purchase', notes: 'Webcam stock replenishment', created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[6]?.id, transaction_type: 'out', quantity: 8, previous_stock: 14, new_stock: 6, reference: 'SO-2026-003', reason: 'sale', notes: 'Customer purchase', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[7]?.id, transaction_type: 'in', quantity: 10, previous_stock: 5, new_stock: 15, reference: 'PO-2026-005', reason: 'purchase', notes: 'SSD stock arrival', created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[8]?.id, transaction_type: 'out', quantity: 25, previous_stock: 125, new_stock: 100, reference: 'SO-2026-004', reason: 'sale', notes: 'Bulk t-shirt order', created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[9]?.id, transaction_type: 'in', quantity: 30, previous_stock: 35, new_stock: 65, reference: 'PO-2026-006', reason: 'purchase', notes: 'Jeans restock', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), user_id: managerUser?.id },
                { id: this.generateId(), product_id: products_list[10]?.id, transaction_type: 'out', quantity: 12, previous_stock: 57, new_stock: 45, reference: 'SO-2026-005', reason: 'sale', notes: 'Formal shirts sold', created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[11]?.id, transaction_type: 'in', quantity: 15, previous_stock: 0, new_stock: 7, reference: 'PO-2026-007', reason: 'purchase', notes: 'Sports shoes arrival', created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[12]?.id, transaction_type: 'out', quantity: 8, previous_stock: 36, new_stock: 28, reference: 'SO-2026-006', reason: 'sale', notes: 'Winter jacket sales', created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[13]?.id, transaction_type: 'in', quantity: 20, previous_stock: 10, new_stock: 30, reference: 'PO-2026-008', reason: 'purchase', notes: 'JavaScript books received', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), user_id: managerUser?.id },
                { id: this.generateId(), product_id: products_list[14]?.id, transaction_type: 'out', quantity: 10, previous_stock: 35, new_stock: 25, reference: 'SO-2026-007', reason: 'sale', notes: 'Python books sold', created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[15]?.id, transaction_type: 'in', quantity: 15, previous_stock: 3, new_stock: 18, reference: 'PO-2026-009', reason: 'purchase', notes: 'Algorithm books stock', created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[16]?.id, transaction_type: 'out', quantity: 5, previous_stock: 27, new_stock: 22, reference: 'SO-2026-008', reason: 'sale', notes: 'Web dev books order', created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[17]?.id, transaction_type: 'in', quantity: 25, previous_stock: 15, new_stock: 40, reference: 'PO-2026-010', reason: 'purchase', notes: 'LED lamps received', created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), user_id: managerUser?.id },
                { id: this.generateId(), product_id: products_list[18]?.id, transaction_type: 'out', quantity: 3, previous_stock: 15, new_stock: 12, reference: 'SO-2026-009', reason: 'sale', notes: 'Office chairs sold', created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[19]?.id, transaction_type: 'in', quantity: 5, previous_stock: 3, new_stock: 8, reference: 'PO-2026-011', reason: 'purchase', notes: 'Standing desks arrival', created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[20]?.id, transaction_type: 'out', quantity: 8, previous_stock: 33, new_stock: 25, reference: 'SO-2026-010', reason: 'sale', notes: 'Wall clocks sold', created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[21]?.id, transaction_type: 'in', quantity: 30, previous_stock: 5, new_stock: 35, reference: 'PO-2026-012', reason: 'purchase', notes: 'Yoga mats bulk order', created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), user_id: managerUser?.id },
                { id: this.generateId(), product_id: products_list[22]?.id, transaction_type: 'out', quantity: 4, previous_stock: 9, new_stock: 5, reference: 'SO-2026-011', reason: 'sale', notes: 'Dumbbell sets sold', created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id },
                { id: this.generateId(), product_id: products_list[23]?.id, transaction_type: 'in', quantity: 20, previous_stock: 22, new_stock: 42, reference: 'PO-2026-013', reason: 'purchase', notes: 'Resistance bands stock', created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(), user_id: adminUser?.id },
                { id: this.generateId(), product_id: products_list[0]?.id, transaction_type: 'out', quantity: 5, previous_stock: 30, new_stock: 25, reference: 'SO-2026-012', reason: 'sale', notes: 'Dell laptops corporate sale', created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), user_id: staffUser?.id }
            ];
            
            localStorage.setItem(DB_CONFIG.tables.stock_logs, JSON.stringify(defaultStockLogs));
        }
    }

    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Simple password hashing (for demo purposes)
     * In production, use proper server-side hashing
     * @param {string} password Plain text password
     * @returns {string} Hashed password
     */
    hashPassword(password) {
        // Simple hash for demo - in production use proper server-side hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return 'hash_' + Math.abs(hash).toString(36);
    }

    /**
     * Verify password against hash
     * @param {string} password Plain text password
     * @param {string} hash Hashed password
     * @returns {boolean} True if password matches
     */
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    /**
     * Get all records from a table
     * @param {string} table Table name
     * @returns {Array} Array of records
     */
    getAll(table) {
        const tableName = DB_CONFIG.tables[table];
        if (!tableName) {
            throw new Error(`Table '${table}' not found`);
        }
        
        const data = localStorage.getItem(tableName);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Get a single record by ID
     * @param {string} table Table name
     * @param {string} id Record ID
     * @returns {Object|null} Record or null if not found
     */
    getById(table, id) {
        const records = this.getAll(table);
        return records.find(record => record.id === id) || null;
    }

    /**
     * Find records by criteria
     * @param {string} table Table name
     * @param {Object} criteria Search criteria
     * @returns {Array} Matching records
     */
    find(table, criteria) {
        const records = this.getAll(table);
        return records.filter(record => {
            return Object.keys(criteria).every(key => {
                if (typeof criteria[key] === 'string') {
                    return record[key]?.toString().toLowerCase().includes(criteria[key].toLowerCase());
                }
                return record[key] === criteria[key];
            });
        });
    }

    /**
     * Find a single record by criteria
     * @param {string} table Table name
     * @param {Object} criteria Search criteria
     * @returns {Object|null} First matching record or null
     */
    findOne(table, criteria) {
        const results = this.find(table, criteria);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Insert a new record
     * @param {string} table Table name
     * @param {Object} data Record data
     * @returns {string} ID of inserted record
     */
    insert(table, data) {
        const records = this.getAll(table);
        const newRecord = {
            id: this.generateId(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        records.push(newRecord);
        
        const tableName = DB_CONFIG.tables[table];
        localStorage.setItem(tableName, JSON.stringify(records));
        
        // Log activity
        this.logActivity('INSERT', table, newRecord.id);
        
        return newRecord.id;
    }

    /**
     * Update a record by ID
     * @param {string} table Table name
     * @param {string} id Record ID
     * @param {Object} data Updated data
     * @returns {boolean} True if record was updated
     */
    update(table, id, data) {
        const records = this.getAll(table);
        const index = records.findIndex(record => record.id === id);
        
        if (index === -1) {
            return false;
        }
        
        records[index] = {
            ...records[index],
            ...data,
            updated_at: new Date().toISOString()
        };
        
        const tableName = DB_CONFIG.tables[table];
        localStorage.setItem(tableName, JSON.stringify(records));
        
        // Log activity
        this.logActivity('UPDATE', table, id);
        
        return true;
    }

    /**
     * Delete a record by ID
     * @param {string} table Table name
     * @param {string} id Record ID
     * @returns {boolean} True if record was deleted
     */
    delete(table, id) {
        const records = this.getAll(table);
        const index = records.findIndex(record => record.id === id);
        
        if (index === -1) {
            return false;
        }
        
        records.splice(index, 1);
        
        const tableName = DB_CONFIG.tables[table];
        localStorage.setItem(tableName, JSON.stringify(records));
        
        // Log activity
        this.logActivity('DELETE', table, id);
        
        return true;
    }

    /**
     * Count records in a table
     * @param {string} table Table name
     * @param {Object} criteria Optional search criteria
     * @returns {number} Number of records
     */
    count(table, criteria = {}) {
        if (Object.keys(criteria).length === 0) {
            return this.getAll(table).length;
        }
        return this.find(table, criteria).length;
    }

    /**
     * Log activity
     * @param {string} action Action performed
     * @param {string} table Table affected
     * @param {string} recordId Record ID
     */
    logActivity(action, table, recordId = null) {
        try {
            const currentUser = JSON.parse(localStorage.getItem('stockwise_current_user') || '{}');
            
            const logEntry = {
                id: this.generateId(),
                action: action,
                table_name: table,
                record_id: recordId,
                user_id: currentUser.id || null,
                username: currentUser.username || 'anonymous',
                ip_address: 'client-side',
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            
            const logs = this.getAll('activity_logs');
            logs.push(logEntry);
            
            // Keep only last 1000 logs
            if (logs.length > 1000) {
                logs.splice(0, logs.length - 1000);
            }
            
            localStorage.setItem(DB_CONFIG.tables.activity_logs, JSON.stringify(logs));
        } catch (error) {
            // Silently fail if logging fails
        }
    }

    /**
     * Clear all data (for testing purposes)
     */
    clearAll() {
        Object.values(DB_CONFIG.tables).forEach(table => {
            localStorage.removeItem(table);
        });
        this.initializeDatabase();
    }

    /**
     * Export data as JSON
     * @returns {Object} All database data
     */
    exportData() {
        const data = {};
        Object.keys(DB_CONFIG.tables).forEach(table => {
            data[table] = this.getAll(table);
        });
        return data;
    }

    /**
     * Import data from JSON
     * @param {Object} data Data to import
     */
    importData(data) {
        Object.keys(data).forEach(table => {
            if (DB_CONFIG.tables[table]) {
                localStorage.setItem(DB_CONFIG.tables[table], JSON.stringify(data[table]));
            }
        });
    }
}

// ===== AUTHENTICATION HELPERS =====

/**
 * Authenticate user with username and password
 * @param {string} username Username
 * @param {string} password Password
 * @returns {Object|null} User object if authenticated, null otherwise
 */
function authenticateUser(username, password) {
    const user = db.findOne('users', { username: username, status: 'active' });
    
    if (user && db.verifyPassword(password, user.password)) {
        // Update last login
        db.update('users', user.id, { last_login: new Date().toISOString() });
        
        // Create session data (exclude password)
        const sessionUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        // Store current user
        localStorage.setItem('stockwise_current_user', JSON.stringify(sessionUser));
        
        return sessionUser;
    }
    
    return null;
}

/**
 * Get current logged-in user
 * @returns {Object|null} Current user or null
 */
function getCurrentUser() {
    const userData = localStorage.getItem('stockwise_current_user');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Logout current user
 */
function logoutUser() {
    localStorage.removeItem('stockwise_current_user');
    db.logActivity('LOGOUT', 'users');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Check if user has specific role
 * @param {string} role Role to check
 * @returns {boolean} True if user has the role
 */
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// ===== INITIALIZE DATABASE =====
const db = new ClientDatabase();

// ===== EXPORT FOR GLOBAL USE =====
window.StockWiseDB = {
    db,
    authenticateUser,
    getCurrentUser,
    logoutUser,
    isAuthenticated,
    hasRole,
    DB_CONFIG
};