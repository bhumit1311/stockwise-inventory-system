-- StockWise Inventory Management System
-- SQLite Database Schema and Data
-- Compatible with SQLite 3.x

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- ========================================
-- TABLE: stockwise_users
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_users (
    id TEXT PRIMARY KEY NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user', 'staff')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT DEFAULT NULL
);

-- Insert users
INSERT INTO stockwise_users (id, username, email, password, full_name, role, status, created_at, last_login) VALUES
('user_admin_001', 'admin', 'admin@stockwise.com', 'hash_16782', 'System Administrator', 'admin', 'active', '2026-01-01 10:00:00', NULL),
('user_manager_001', 'manager', 'manager@stockwise.com', 'hash_16782', 'Store Manager', 'user', 'active', '2026-01-01 10:00:00', NULL),
('user_staff_001', 'staff', 'staff@stockwise.com', 'hash_16782', 'Staff Member', 'staff', 'active', '2026-01-01 10:00:00', NULL),
('user_regular_001', 'user', 'user@stockwise.com', 'hash_16782', 'Regular User', 'user', 'active', '2026-01-01 10:00:00', NULL);

-- ========================================
-- TABLE: stockwise_categories
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Insert categories
INSERT INTO stockwise_categories (id, name, description, status, created_at) VALUES
('cat_elec_001', 'Electronics', 'Electronic devices and components', 'active', '2026-01-01 10:00:00'),
('cat_clth_001', 'Clothing', 'Apparel and fashion items', 'active', '2026-01-01 10:00:00'),
('cat_book_001', 'Books', 'Books and educational materials', 'active', '2026-01-01 10:00:00'),
('cat_home_001', 'Home & Garden', 'Home improvement and garden supplies', 'active', '2026-01-01 10:00:00'),
('cat_sprt_001', 'Sports', 'Sports equipment and accessories', 'active', '2026-01-01 10:00:00');

-- ========================================
-- TABLE: stockwise_suppliers
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_suppliers (
    id TEXT PRIMARY KEY NOT NULL,
    supplier_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Insert suppliers
INSERT INTO stockwise_suppliers (id, supplier_name, contact_person, email, phone, address, status, created_at) VALUES
('sup_tech_001', 'TechCorp Solutions', 'John Smith', 'john@techcorp.com', '+91-9876543210', '123 Tech Street, Mumbai, Maharashtra 400001', 'active', '2026-01-01 10:00:00'),
('sup_fash_001', 'Fashion Hub Ltd', 'Sarah Johnson', 'sarah@fashionhub.com', '+91-9876543211', '456 Fashion Avenue, Delhi, Delhi 110001', 'active', '2026-01-01 10:00:00'),
('sup_book_001', 'BookWorld Publishers', 'Michael Brown', 'michael@bookworld.com', '+91-9876543212', '789 Knowledge Lane, Bangalore, Karnataka 560001', 'active', '2026-01-01 10:00:00'),
('sup_elec_001', 'Electronics Mart', 'David Lee', 'david@electronicsmart.com', '+91-9876543213', '321 Electronics Plaza, Pune, Maharashtra 411001', 'active', '2026-01-01 10:00:00'),
('sup_sprt_001', 'Sports Equipment Co', 'Emma Wilson', 'emma@sportsequip.com', '+91-9876543214', '654 Sports Complex, Chennai, Tamil Nadu 600001', 'active', '2026-01-01 10:00:00'),
('sup_home_001', 'Home Decor Plus', 'Robert Taylor', 'robert@homedecor.com', '+91-9876543215', '987 Decor Street, Hyderabad, Telangana 500001', 'active', '2026-01-01 10:00:00');

-- ========================================
-- TABLE: stockwise_products
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_products (
    id TEXT PRIMARY KEY NOT NULL,
    product_name TEXT NOT NULL,
    product_code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    supplier_id TEXT,
    unit_price REAL NOT NULL DEFAULT 0.00,
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'piece',
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (supplier_id) REFERENCES stockwise_suppliers(id) ON DELETE SET NULL
);

-- Insert products (Electronics)
INSERT INTO stockwise_products (id, product_name, product_code, category, supplier_id, unit_price, current_stock, minimum_stock, unit, status, created_at) VALUES
('prod_elec_001', 'Laptop Dell Inspiron 15', 'ELEC-001', 'Electronics', 'sup_tech_001', 45000.00, 25, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_002', 'HP Laptop ProBook 450', 'ELEC-002', 'Electronics', 'sup_tech_001', 52000.00, 18, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_003', 'Wireless Mouse Logitech', 'ELEC-003', 'Electronics', 'sup_tech_001', 1500.00, 50, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_004', 'Mechanical Keyboard RGB', 'ELEC-004', 'Electronics', 'sup_tech_001', 3500.00, 8, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_005', 'USB-C Hub 7-in-1', 'ELEC-005', 'Electronics', 'sup_tech_001', 2200.00, 35, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_006', 'Webcam HD 1080p', 'ELEC-006', 'Electronics', 'sup_tech_001', 4500.00, 22, 8, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_007', 'Wireless Headphones', 'ELEC-007', 'Electronics', 'sup_tech_001', 2800.00, 6, 12, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_008', 'External SSD 1TB', 'ELEC-008', 'Electronics', 'sup_tech_001', 8500.00, 15, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_009', 'Smart Watch Series 5', 'ELEC-009', 'Electronics', 'sup_tech_001', 12000.00, 3, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_010', 'Tablet 10-inch', 'ELEC-010', 'Electronics', 'sup_tech_001', 18000.00, 15, 5, 'piece', 'active', '2026-01-15 10:00:00');

-- Insert products (Clothing)
INSERT INTO stockwise_products (id, product_name, product_code, category, supplier_id, unit_price, current_stock, minimum_stock, unit, status, created_at) VALUES
('prod_clth_001', 'Cotton T-Shirt Blue', 'CLTH-001', 'Clothing', 'sup_fash_001', 500.00, 100, 30, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_002', 'Denim Jeans Regular Fit', 'CLTH-002', 'Clothing', 'sup_fash_001', 1200.00, 65, 20, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_003', 'Formal Shirt White', 'CLTH-003', 'Clothing', 'sup_fash_001', 800.00, 45, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_004', 'Sports Shoes Running', 'CLTH-004', 'Clothing', 'sup_fash_001', 2500.00, 7, 15, 'pair', 'active', '2026-01-15 10:00:00'),
('prod_clth_005', 'Winter Jacket Black', 'CLTH-005', 'Clothing', 'sup_fash_001', 3500.00, 28, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_006', 'Cotton Hoodie Grey', 'CLTH-006', 'Clothing', 'sup_fash_001', 1500.00, 40, 15, 'piece', 'active', '2026-01-15 10:00:00');

-- Insert products (Books)
INSERT INTO stockwise_products (id, product_name, product_code, category, supplier_id, unit_price, current_stock, minimum_stock, unit, status, created_at) VALUES
('prod_book_001', 'JavaScript Complete Guide', 'BOOK-001', 'Books', 'sup_book_001', 800.00, 30, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_book_002', 'Python for Beginners', 'BOOK-002', 'Books', 'sup_book_001', 750.00, 25, 8, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_book_003', 'Data Structures & Algorithms', 'BOOK-003', 'Books', 'sup_book_001', 950.00, 18, 8, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_book_004', 'Web Development Handbook', 'BOOK-004', 'Books', 'sup_book_001', 850.00, 22, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_book_005', 'The AI Revolution', 'BOOK-005', 'Books', 'sup_book_001', 1200.00, 0, 5, 'piece', 'active', '2026-01-15 10:00:00');

-- Insert products (Home & Garden)
INSERT INTO stockwise_products (id, product_name, product_code, category, supplier_id, unit_price, current_stock, minimum_stock, unit, status, created_at) VALUES
('prod_home_001', 'LED Desk Lamp', 'HOME-001', 'Home & Garden', 'sup_tech_001', 1200.00, 40, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_home_002', 'Office Chair Ergonomic', 'HOME-002', 'Home & Garden', 'sup_tech_001', 8500.00, 12, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_home_003', 'Standing Desk Adjustable', 'HOME-003', 'Home & Garden', 'sup_tech_001', 15000.00, 8, 3, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_home_004', 'Wall Clock Digital', 'HOME-004', 'Home & Garden', 'sup_tech_001', 1500.00, 25, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_home_005', 'Ceramic Plant Pot', 'HOME-005', 'Home & Garden', 'sup_tech_001', 450.00, 60, 20, 'piece', 'active', '2026-01-15 10:00:00');

-- Insert products (Sports)
INSERT INTO stockwise_products (id, product_name, product_code, category, supplier_id, unit_price, current_stock, minimum_stock, unit, status, created_at) VALUES
('prod_sprt_001', 'Yoga Mat Premium', 'SPRT-001', 'Sports', 'sup_fash_001', 1200.00, 35, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_sprt_002', 'Dumbbell Set 20kg', 'SPRT-002', 'Sports', 'sup_fash_001', 3500.00, 5, 8, 'set', 'active', '2026-01-15 10:00:00'),
('prod_sprt_003', 'Resistance Bands Set', 'SPRT-003', 'Sports', 'sup_fash_001', 800.00, 42, 20, 'set', 'active', '2026-01-15 10:00:00'),
('prod_sprt_004', 'Pro Tennis Racket', 'SPRT-004', 'Sports', 'sup_fash_001', 8500.00, 4, 8, 'piece', 'active', '2026-01-15 10:00:00');

-- ========================================
-- TABLE: stockwise_stock_logs
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_stock_logs (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('in', 'out')),
    quantity INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reference TEXT,
    reason TEXT,
    notes TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES stockwise_products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES stockwise_users(id) ON DELETE SET NULL
);

-- Insert stock logs
INSERT INTO stockwise_stock_logs (id, product_id, transaction_type, quantity, previous_stock, new_stock, reference, reason, notes, user_id, created_at) VALUES
-- Recent transactions
('log_001', 'prod_elec_001', 'in', 10, 15, 25, 'PO-2026-001', 'purchase', 'New stock arrival from supplier', 'user_admin_001', '2026-02-07 10:00:00'),
('log_002', 'prod_elec_002', 'in', 8, 10, 18, 'PO-2026-002', 'purchase', 'Restocking HP laptops', 'user_admin_001', '2026-02-06 10:00:00'),
('log_003', 'prod_elec_003', 'out', 15, 65, 50, 'SO-2026-001', 'sale', 'Sold to corporate client', 'user_staff_001', '2026-02-08 10:00:00'),
('log_004', 'prod_elec_004', 'out', 5, 13, 8, 'SO-2026-002', 'sale', 'Office supply order', 'user_staff_001', '2026-02-05 10:00:00'),
('log_005', 'prod_elec_005', 'in', 20, 15, 35, 'PO-2026-003', 'purchase', 'Bulk order received', 'user_manager_001', '2026-02-04 10:00:00'),
('log_006', 'prod_elec_006', 'in', 12, 10, 22, 'PO-2026-004', 'purchase', 'Webcam stock replenishment', 'user_admin_001', '2026-02-03 10:00:00'),
('log_007', 'prod_elec_007', 'out', 8, 14, 6, 'SO-2026-003', 'sale', 'Customer purchase', 'user_staff_001', '2026-02-02 10:00:00'),
('log_008', 'prod_elec_008', 'in', 10, 5, 15, 'PO-2026-005', 'purchase', 'SSD stock arrival', 'user_admin_001', '2026-02-01 10:00:00'),
('log_009', 'prod_clth_001', 'out', 25, 125, 100, 'SO-2026-004', 'sale', 'Bulk t-shirt order', 'user_staff_001', '2026-01-31 10:00:00'),
('log_010', 'prod_clth_002', 'in', 30, 35, 65, 'PO-2026-006', 'purchase', 'Jeans restock', 'user_manager_001', '2026-01-30 10:00:00'),
('log_011', 'prod_clth_003', 'out', 12, 57, 45, 'SO-2026-005', 'sale', 'Formal shirts sold', 'user_staff_001', '2026-01-29 10:00:00'),
('log_012', 'prod_clth_004', 'in', 15, 0, 7, 'PO-2026-007', 'purchase', 'Sports shoes arrival', 'user_admin_001', '2026-01-28 10:00:00'),
('log_013', 'prod_clth_005', 'out', 8, 36, 28, 'SO-2026-006', 'sale', 'Winter jacket sales', 'user_staff_001', '2026-01-27 10:00:00'),
('log_014', 'prod_book_001', 'in', 20, 10, 30, 'PO-2026-008', 'purchase', 'JavaScript books received', 'user_manager_001', '2026-01-26 10:00:00'),
('log_015', 'prod_book_002', 'out', 10, 35, 25, 'SO-2026-007', 'sale', 'Python books sold', 'user_staff_001', '2026-01-25 10:00:00'),
('log_016', 'prod_book_003', 'in', 15, 3, 18, 'PO-2026-009', 'purchase', 'Algorithm books stock', 'user_admin_001', '2026-01-24 10:00:00'),
('log_017', 'prod_book_004', 'out', 5, 27, 22, 'SO-2026-008', 'sale', 'Web dev books order', 'user_staff_001', '2026-01-23 10:00:00'),
('log_018', 'prod_home_001', 'in', 25, 15, 40, 'PO-2026-010', 'purchase', 'LED lamps received', 'user_manager_001', '2026-01-22 10:00:00'),
('log_019', 'prod_home_002', 'out', 3, 15, 12, 'SO-2026-009', 'sale', 'Office chairs sold', 'user_staff_001', '2026-01-21 10:00:00'),
('log_020', 'prod_home_003', 'in', 5, 3, 8, 'PO-2026-011', 'purchase', 'Standing desks arrival', 'user_admin_001', '2026-01-20 10:00:00'),
('log_021', 'prod_home_004', 'out', 8, 33, 25, 'SO-2026-010', 'sale', 'Wall clocks sold', 'user_staff_001', '2026-01-19 10:00:00'),
('log_022', 'prod_sprt_001', 'in', 30, 5, 35, 'PO-2026-012', 'purchase', 'Yoga mats bulk order', 'user_manager_001', '2026-01-18 10:00:00'),
('log_023', 'prod_sprt_002', 'out', 4, 9, 5, 'SO-2026-011', 'sale', 'Dumbbell sets sold', 'user_staff_001', '2026-01-17 10:00:00'),
('log_024', 'prod_sprt_003', 'in', 20, 22, 42, 'PO-2026-013', 'purchase', 'Resistance bands stock', 'user_admin_001', '2026-01-16 10:00:00'),
('log_025', 'prod_elec_001', 'out', 5, 30, 25, 'SO-2026-012', 'sale', 'Dell laptops corporate sale', 'user_staff_001', '2026-01-15 10:00:00'),
-- Logs for newer products
('log_026', 'prod_elec_009', 'in', 5, 0, 5, 'PO-2026-014', 'purchase', 'Smart Watch initial stock', 'user_admin_001', '2026-02-07 10:00:00'),
('log_027', 'prod_elec_009', 'out', 2, 5, 3, 'SO-2026-013', 'sale', 'Smart Watch customer sale', 'user_staff_001', '2026-02-08 10:00:00'),
('log_028', 'prod_clth_006', 'in', 50, 0, 50, 'PO-2026-015', 'purchase', 'Hoodies season stock', 'user_manager_001', '2026-01-30 10:00:00'),
('log_029', 'prod_clth_006', 'out', 10, 50, 40, 'SO-2026-014', 'sale', 'Hoodies bulk order', 'user_staff_001', '2026-02-04 10:00:00'),
('log_030', 'prod_book_005', 'in', 10, 0, 10, 'PO-2026-016', 'purchase', 'AI Books received', 'user_admin_001', '2026-01-25 10:00:00'),
('log_031', 'prod_book_005', 'out', 10, 10, 0, 'SO-2026-015', 'sale', 'Sold out quickly', 'user_staff_001', '2026-02-08 10:00:00'),
('log_032', 'prod_home_005', 'in', 60, 0, 60, 'PO-2026-017', 'purchase', 'Plant pots arrival', 'user_manager_001', '2026-01-20 10:00:00'),
('log_033', 'prod_sprt_004', 'in', 5, 0, 5, 'PO-2026-018', 'purchase', 'Tennis rackets stock', 'user_admin_001', '2026-02-01 10:00:00'),
('log_034', 'prod_sprt_004', 'out', 1, 5, 4, 'SO-2026-016', 'sale', 'Racket sale', 'user_staff_001', '2026-02-07 10:00:00'),
('log_035', 'prod_elec_010', 'in', 15, 0, 15, 'PO-2026-019', 'purchase', 'Tablets received', 'user_manager_001', '2026-02-04 10:00:00');

-- ========================================
-- TABLE: stockwise_activity_logs
-- ========================================

CREATE TABLE IF NOT EXISTS stockwise_activity_logs (
    id TEXT PRIMARY KEY NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    user_id TEXT,
    username TEXT,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Insert sample activity logs
INSERT INTO stockwise_activity_logs (id, action, table_name, record_id, user_id, username, ip_address, user_agent, timestamp) VALUES
('activity_001', 'INSERT', 'products', 'prod_elec_001', 'user_admin_001', 'admin', 'client-side', 'Mozilla/5.0', '2026-01-15 10:00:00'),
('activity_002', 'UPDATE', 'products', 'prod_elec_001', 'user_admin_001', 'admin', 'client-side', 'Mozilla/5.0', '2026-02-07 10:00:00'),
('activity_003', 'INSERT', 'stock_logs', 'log_001', 'user_admin_001', 'admin', 'client-side', 'Mozilla/5.0', '2026-02-07 10:00:00'),
('activity_004', 'INSERT', 'stock_logs', 'log_003', 'user_staff_001', 'staff', 'client-side', 'Mozilla/5.0', '2026-02-08 10:00:00'),
('activity_005', 'UPDATE', 'users', 'user_admin_001', 'user_admin_001', 'admin', 'client-side', 'Mozilla/5.0', '2026-02-08 10:00:00');

-- ========================================
-- INDEXES for Performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_products_category ON stockwise_products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON stockwise_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON stockwise_products(status);
CREATE INDEX IF NOT EXISTS idx_stock_logs_product ON stockwise_stock_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_user ON stockwise_stock_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_date ON stockwise_stock_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON stockwise_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON stockwise_activity_logs(timestamp);

-- ========================================
-- VIEWS for Common Queries
-- ========================================

-- View: Products with low stock
CREATE VIEW IF NOT EXISTS v_low_stock_products AS
SELECT 
    p.id,
    p.product_name,
    p.product_code,
    p.category,
    p.current_stock,
    p.minimum_stock,
    p.unit_price,
    s.supplier_name
FROM stockwise_products p
LEFT JOIN stockwise_suppliers s ON p.supplier_id = s.id
WHERE p.current_stock <= p.minimum_stock
AND p.status = 'active';

-- View: Recent stock movements
CREATE VIEW IF NOT EXISTS v_recent_stock_movements AS
SELECT 
    sl.id,
    sl.transaction_type,
    sl.quantity,
    sl.reference,
    sl.reason,
    sl.created_at,
    p.product_name,
    p.product_code,
    u.username
FROM stockwise_stock_logs sl
JOIN stockwise_products p ON sl.product_id = p.id
LEFT JOIN stockwise_users u ON sl.user_id = u.id
ORDER BY sl.created_at DESC
LIMIT 50;

-- View: Product inventory summary
CREATE VIEW IF NOT EXISTS v_inventory_summary AS
SELECT 
    p.category,
    COUNT(*) as total_products,
    SUM(p.current_stock) as total_stock,
    SUM(p.current_stock * p.unit_price) as total_value,
    SUM(CASE WHEN p.current_stock <= p.minimum_stock THEN 1 ELSE 0 END) as low_stock_count
FROM stockwise_products p
WHERE p.status = 'active'
GROUP BY p.category;

-- ========================================
-- Database Statistics
-- ========================================

-- Query to check table counts
-- SELECT 'Users' as table_name, COUNT(*) as count FROM stockwise_users
-- UNION ALL
-- SELECT 'Categories', COUNT(*) FROM stockwise_categories
-- UNION ALL
-- SELECT 'Suppliers', COUNT(*) FROM stockwise_suppliers
-- UNION ALL
-- SELECT 'Products', COUNT(*) FROM stockwise_products
-- UNION ALL
-- SELECT 'Stock Logs', COUNT(*) FROM stockwise_stock_logs
-- UNION ALL
-- SELECT 'Activity Logs', COUNT(*) FROM stockwise_activity_logs;
