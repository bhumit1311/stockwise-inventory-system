# StockWise Database Schema

## Overview
This document describes the data structure used in the StockWise Inventory Management System. The system uses localStorage for client-side data persistence.

## Tables

### 1. Users (`stockwise_users`)
Stores user account information and authentication details.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| username | string | Login username (unique) | Yes |
| email | string | User email address | Yes |
| password | string | Hashed password | Yes |
| full_name | string | User's full name | Yes |
| role | enum | User role: 'admin', 'user', 'staff' | Yes |
| status | enum | Account status: 'active', 'inactive' | Yes |
| created_at | datetime | Account creation timestamp | Auto |
| last_login | datetime | Last login timestamp | Auto |
| updated_at | datetime | Last update timestamp | Auto |

**Indexes:** username, email, role

**Sample Data:**
```json
{
  "id": "abc123",
  "username": "admin",
  "email": "admin@stockwise.com",
  "password": "hash_xyz",
  "full_name": "System Administrator",
  "role": "admin",
  "status": "active",
  "created_at": "2026-01-01T00:00:00.000Z",
  "last_login": "2026-01-29T18:00:00.000Z"
}
```

---

### 2. Products (`stockwise_products`)
Stores product inventory information.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| product_code | string | Product SKU/code (unique) | Yes |
| product_name | string | Product name | Yes |
| category | string | Product category | Yes |
| supplier_id | string | Reference to supplier | Yes |
| unit_price | decimal | Price per unit | Yes |
| current_stock | integer | Current stock quantity | Yes |
| minimum_stock | integer | Minimum stock threshold | Yes |
| unit | string | Unit of measurement | Yes |
| status | enum | Product status: 'active', 'inactive' | Yes |
| created_at | datetime | Creation timestamp | Auto |
| updated_at | datetime | Last update timestamp | Auto |

**Indexes:** product_code, category, supplier_id

**Sample Data:**
```json
{
  "id": "prod123",
  "product_code": "ELEC-001",
  "product_name": "Laptop Dell Inspiron 15",
  "category": "Electronics",
  "supplier_id": "sup123",
  "unit_price": 45000,
  "current_stock": 25,
  "minimum_stock": 5,
  "unit": "piece",
  "status": "active",
  "created_at": "2026-01-15T10:00:00.000Z"
}
```

---

### 3. Suppliers (`stockwise_suppliers`)
Stores supplier/vendor information.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| supplier_name | string | Supplier company name | Yes |
| contact_person | string | Contact person name | Yes |
| email | string | Supplier email | Yes |
| phone | string | Contact phone number | Yes |
| address | text | Full address | Yes |
| status | enum | Supplier status: 'active', 'inactive' | Yes |
| created_at | datetime | Creation timestamp | Auto |
| updated_at | datetime | Last update timestamp | Auto |

**Indexes:** supplier_name, status

**Sample Data:**
```json
{
  "id": "sup123",
  "supplier_name": "TechCorp Solutions",
  "contact_person": "John Smith",
  "email": "john@techcorp.com",
  "phone": "+91-9876543210",
  "address": "123 Tech Street, Mumbai, Maharashtra 400001",
  "status": "active",
  "created_at": "2026-01-10T09:00:00.000Z"
}
```

---

### 4. Stock Logs (`stockwise_stock_logs`)
Tracks all stock movements (in/out).

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| product_id | string | Reference to product | Yes |
| transaction_type | enum | Type: 'in', 'out' | Yes |
| quantity | integer | Quantity moved | Yes |
| previous_stock | integer | Stock before transaction | Yes |
| new_stock | integer | Stock after transaction | Yes |
| reference | string | Reference number (PO/SO) | No |
| reason | string | Reason for movement | Yes |
| notes | text | Additional notes | No |
| user_id | string | User who performed action | Yes |
| created_at | datetime | Transaction timestamp | Auto |

**Indexes:** product_id, transaction_type, created_at

**Sample Data:**
```json
{
  "id": "log123",
  "product_id": "prod123",
  "transaction_type": "in",
  "quantity": 10,
  "previous_stock": 15,
  "new_stock": 25,
  "reference": "PO-2026-001",
  "reason": "purchase",
  "notes": "New stock arrival from supplier",
  "user_id": "user123",
  "created_at": "2026-01-27T14:30:00.000Z"
}
```

---

### 5. Activity Logs (`stockwise_activity_logs`)
Tracks all user activities in the system.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| action | enum | Action type: 'INSERT', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT' | Yes |
| table_name | string | Affected table name | Yes |
| record_id | string | Affected record ID | No |
| user_id | string | User who performed action | Yes |
| username | string | Username for quick reference | Yes |
| ip_address | string | IP address | No |
| user_agent | string | Browser user agent | No |
| timestamp | datetime | Action timestamp | Auto |

**Indexes:** user_id, action, timestamp

**Sample Data:**
```json
{
  "id": "act123",
  "action": "INSERT",
  "table_name": "products",
  "record_id": "prod123",
  "user_id": "user123",
  "username": "admin",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2026-01-29T18:00:00.000Z"
}
```

---

### 6. Categories (`stockwise_categories`)
Stores product categories.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| id | string | Unique identifier | Yes |
| name | string | Category name | Yes |
| description | text | Category description | No |
| status | enum | Category status: 'active', 'inactive' | Yes |
| created_at | datetime | Creation timestamp | Auto |
| updated_at | datetime | Last update timestamp | Auto |

**Indexes:** name, status

**Sample Data:**
```json
{
  "id": "cat123",
  "name": "Electronics",
  "description": "Electronic devices and components",
  "status": "active",
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## Relationships

### One-to-Many Relationships

1. **Suppliers → Products**
   - One supplier can supply many products
   - Foreign Key: `products.supplier_id` → `suppliers.id`

2. **Products → Stock Logs**
   - One product can have many stock movements
   - Foreign Key: `stock_logs.product_id` → `products.id`

3. **Users → Stock Logs**
   - One user can create many stock logs
   - Foreign Key: `stock_logs.user_id` → `users.id`

4. **Users → Activity Logs**
   - One user can have many activity logs
   - Foreign Key: `activity_logs.user_id` → `users.id`

5. **Categories → Products**
   - One category can have many products
   - Relationship: `products.category` matches `categories.name`

---

## Data Validation Rules

### Users
- Username: 3-50 characters, alphanumeric
- Email: Valid email format
- Password: Minimum 6 characters (hashed)
- Role: Must be 'admin', 'user', or 'staff'

### Products
- Product Code: Unique, 3-20 characters
- Unit Price: Positive decimal
- Current Stock: Non-negative integer
- Minimum Stock: Positive integer
- Unit: Valid unit of measurement

### Suppliers
- Email: Valid email format
- Phone: Valid phone format
- Status: 'active' or 'inactive'

### Stock Logs
- Quantity: Positive integer
- Transaction Type: 'in' or 'out'
- New Stock: Must match calculation

---

## Storage Information

- **Storage Type:** Browser localStorage
- **Maximum Size:** ~5-10MB (browser dependent)
- **Persistence:** Data persists until manually cleared
- **Backup:** Use export functionality to backup data

---

## Security Considerations

1. **Password Storage:** Passwords are hashed using client-side hashing
2. **Session Management:** Sessions expire after 1 hour of inactivity
3. **Role-Based Access:** Different roles have different permissions
4. **Activity Logging:** All actions are logged for audit trail

---

## Migration Notes

For future backend integration:
- All IDs should be converted to auto-increment integers
- Add proper foreign key constraints
- Implement server-side password hashing (bcrypt)
- Add database indexes for performance
- Implement proper transaction handling
- Add data validation at database level

---

## Version History

- **v1.0.0** (2026-01-29): Initial schema design