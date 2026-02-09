# StockWise SQLite Database

## 📁 Database File
**File:** `stockwise.db`  
**Type:** SQLite 3.x Database  
**Size:** ~100KB (with sample data)

## 🗂️ Database Structure

### Tables

| Table Name | Description | Record Count |
|------------|-------------|--------------|
| `stockwise_users` | User accounts and authentication | 4 |
| `stockwise_categories` | Product categories | 5 |
| `stockwise_suppliers` | Supplier information | 6 |
| `stockwise_products` | Product inventory | 30 |
| `stockwise_stock_logs` | Stock movement history | 35 |
| `stockwise_activity_logs` | System activity audit trail | 5 |

### Views

| View Name | Description |
|-----------|-------------|
| `v_low_stock_products` | Products at or below minimum stock level |
| `v_recent_stock_movements` | Last 50 stock transactions |
| `v_inventory_summary` | Inventory statistics by category |

## 🔧 How to Open the Database

### Option 1: DB Browser for SQLite (Recommended)
1. Download from: https://sqlitebrowser.org/
2. Install and open DB Browser
3. Click "Open Database"
4. Navigate to `stockwise.db`
5. Browse tables in the "Browse Data" tab

### Option 2: SQLiteStudio
1. Download from: https://sqlitestudio.pl/
2. Install and open SQLiteStudio
3. Database → Add a database
4. Select `stockwise.db`
5. Explore tables and run queries

### Option 3: Command Line
```bash
# Open database
sqlite3 stockwise.db

# List all tables
.tables

# Show table structure
.schema stockwise_products

# Query data
SELECT * FROM stockwise_products LIMIT 10;

# Exit
.quit
```

### Option 4: VS Code Extension
1. Install "SQLite Viewer" or "SQLite" extension
2. Right-click `stockwise.db` → Open Database
3. Explore tables in the sidebar

## 📊 Sample Queries

### View All Products
```sql
SELECT 
    product_code,
    product_name,
    category,
    current_stock,
    minimum_stock,
    unit_price
FROM stockwise_products
ORDER BY category, product_name;
```

### Products with Low Stock (Alert)
```sql
SELECT * FROM v_low_stock_products;
```

### Recent Stock Movements
```sql
SELECT * FROM v_recent_stock_movements LIMIT 20;
```

### Inventory Value by Category
```sql
SELECT * FROM v_inventory_summary;
```

### Top 10 Most Expensive Products
```sql
SELECT 
    product_name,
    product_code,
    unit_price,
    current_stock,
    (unit_price * current_stock) as total_value
FROM stockwise_products
ORDER BY unit_price DESC
LIMIT 10;
```

### Stock Movement History for a Product
```sql
SELECT 
    sl.created_at,
    sl.transaction_type,
    sl.quantity,
    sl.previous_stock,
    sl.new_stock,
    sl.reference,
    sl.reason,
    u.username
FROM stockwise_stock_logs sl
LEFT JOIN stockwise_users u ON sl.user_id = u.id
WHERE sl.product_id = 'prod_elec_001'
ORDER BY sl.created_at DESC;
```

### Products by Supplier
```sql
SELECT 
    s.supplier_name,
    COUNT(p.id) as product_count,
    SUM(p.current_stock * p.unit_price) as total_inventory_value
FROM stockwise_suppliers s
LEFT JOIN stockwise_products p ON s.id = p.supplier_id
GROUP BY s.id, s.supplier_name
ORDER BY total_inventory_value DESC;
```

### User Activity Summary
```sql
SELECT 
    u.username,
    u.role,
    COUNT(sl.id) as stock_transactions
FROM stockwise_users u
LEFT JOIN stockwise_stock_logs sl ON u.id = sl.user_id
GROUP BY u.id, u.username, u.role
ORDER BY stock_transactions DESC;
```

## 🔐 Default User Credentials

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | password123 | admin | admin@stockwise.com |
| manager | password123 | user | manager@stockwise.com |
| staff | password123 | staff | staff@stockwise.com |
| user | password123 | user | user@stockwise.com |

**Note:** Passwords are hashed as `hash_16782` in the database.

## 📈 Database Statistics

```sql
-- Total inventory value
SELECT 
    SUM(current_stock * unit_price) as total_value,
    COUNT(*) as total_products,
    SUM(current_stock) as total_items
FROM stockwise_products;

-- Products by category
SELECT 
    category,
    COUNT(*) as count
FROM stockwise_products
GROUP BY category;

-- Stock transactions by type
SELECT 
    transaction_type,
    COUNT(*) as count,
    SUM(quantity) as total_quantity
FROM stockwise_stock_logs
GROUP BY transaction_type;
```

## 🔄 Recreating the Database

If you need to recreate the database from scratch:

```bash
# Delete existing database
del stockwise.db

# Recreate from SQL script
sqlite3 stockwise.db ".read create_stockwise.sql"
```

## 📝 Notes

- **Foreign Keys:** Enabled by default for data integrity
- **Indexes:** Created on frequently queried columns for performance
- **Views:** Pre-built views for common reporting needs
- **Timestamps:** All dates stored in ISO 8601 format (YYYY-MM-DD HH:MM:SS)
- **IDs:** Text-based IDs for compatibility with the web application

## 🚀 Next Steps

1. **Open the database** in your preferred SQLite viewer
2. **Explore the tables** to understand the data structure
3. **Run sample queries** to see the data
4. **Modify data** as needed for testing
5. **Export data** if you need to migrate to another system

## 💡 Tips

- Use the **Browse Data** tab to view tables visually
- Use the **Execute SQL** tab to run custom queries
- Export results to CSV for analysis in Excel
- Create backups before making changes
- Use transactions for bulk updates

---

**Created:** 2026-02-09  
**Database Version:** 1.0.0  
**Compatible with:** SQLite 3.x
