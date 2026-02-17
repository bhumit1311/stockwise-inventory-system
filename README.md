# 📦 StockWise - Modern Inventory Management System

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

A professional, production-ready inventory management system built with modern web technologies. StockWise provides real-time tracking, comprehensive reporting, and role-based access control for efficient inventory management.

🔗 **Live Demo**: [View Live Site](https://bhumit1311.github.io/stockwise-inventory-system/)

---

## 🌟 Features

### Core Functionality
- ✅ **Real-time Inventory Tracking** - Monitor stock levels in real-time
- ✅ **Product Management** - Add, edit, and manage products with ease
- ✅ **Supplier Management** - Track and manage supplier relationships
- ✅ **User Management** - Role-based access control (Admin & Staff)
- ✅ **Stock Movement Tracking** - Complete audit trail of all stock changes
- ✅ **Low Stock Alerts** - Modal view with quick action buttons
- ✅ **Comprehensive Reports** - Detailed analytics and reporting
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- 📊 **Analytics Dashboard** - Visual statistics and insights
- 🔐 **Secure Authentication** - Session management with auto-expiry
- 📱 **Mobile Optimized** - Touch-friendly interface for mobile devices
- 🎨 **Modern UI/UX** - Clean, professional interface
- 💾 **Data Export** - Export reports to CSV/JSON
- 🔍 **Advanced Search** - Quick product and supplier lookup
- ⚡ **Fast Performance** - Optimized client-side data management
- 🎯 **Role-Based Permissions** - Granular access control

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required - runs entirely in the browser!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhumit1311/stockwise-inventory-system.git
   cd stockwise-inventory-system
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or visit the live site: https://bhumit1311.github.io/stockwise-inventory-system/
   ```

3. **Login with demo credentials**
   - See [Demo Credentials](#-demo-credentials) section below

---

## 👥 User Roles & Permissions

### 🔴 Admin
**Full system access**
- ✅ Manage all products, suppliers, and users
- ✅ Full CRUD operations on all entities
- ✅ View all reports and analytics
- ✅ Access to low stock alerts modal
- ✅ Complete audit trail access

**Default Credentials:**
- Username: `admin`
- Password: `password123`

### 🟡 Staff
**View-only with stock management**
- ✅ **View** products and suppliers (read-only)
- ✅ **Full access** to stock movements (Stock In/Out)
- ✅ View basic reports
- ✅ View low stock alerts
- ❌ **Cannot** add/edit/delete products or suppliers

**Default Credentials:**
- Username: `staff`
- Password: `password123`

> **Note**: The manager role has been removed in v2.0. All manager accounts have been converted to staff role.

---

## 📁 Project Structure

```
stockwise-inventory-system/
├── index.html                 # Landing page
├── README.md                  # This file
├── .gitignore                 # Git ignore rules
│
├── assets/                    # Static assets
│   └── logo.svg              # Application logo
│
├── css/                       # Stylesheets
│   ├── light-theme.css       # Main theme
│   └── mobile-fixes.css      # Mobile responsiveness
│
├── js/                        # JavaScript files
│   ├── core/
│   │   └── authManager.js    # Authentication & authorization
│   ├── services/
│   │   └── dataService.js    # Central data service
│   ├── utils/
│   │   └── uiUtils.js        # UI utilities
│   ├── database.js           # Client-side database (localStorage)
│   ├── login-page.js         # Login functionality
│   ├── register-page.js      # Registration
│   ├── admin-dashboard-page.js
│   ├── user-dashboard-page.js
│   ├── products-page.js
│   ├── suppliers-page.js
│   ├── users-page.js
│   ├── reports-page.js
│   └── stock-movement-page.js
│
└── pages/                     # HTML pages
    ├── login.html
    ├── register.html
    ├── admin-dashboard.html
    ├── user-dashboard.html
    ├── products.html
    ├── suppliers.html
    ├── users.html
    ├── reports.html
    └── stock-movement.html
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5.3** - Responsive framework
- **Font Awesome 6.0** - Icon library

### Data Management
- **localStorage API** - Client-side data persistence
- **Custom Database Layer** - Abstraction over localStorage
- **JSON** - Data format

### Architecture
- **MVC Pattern** - Separation of concerns
- **Modular Design** - Reusable components
- **Service Layer** - Centralized data access
- **Guard System** - Route protection

---

## 📊 Key Features Explained

### 1. Dashboard
- Real-time statistics (products, suppliers, low stock count)
- Recent activity feed
- Low stock alerts with modal view
- Quick action buttons
- Role-based content display

### 2. Product Management
- Add/Edit/Delete products (Admin only)
- View products (All users)
- Category organization
- Stock level tracking
- Supplier assignment
- Status management

### 3. Supplier Management
- Add/Edit/Delete suppliers (Admin only)
- View suppliers (All users)
- Contact information management
- Product associations
- Status tracking

### 4. Stock Movement
- Stock In/Out operations (All users)
- Reason tracking (Purchase, Return, Sale)
- Automatic stock level updates
- Complete movement history
- Audit trail

### 5. Reports & Analytics
- Inventory reports
- Supplier reports
- Low stock reports
- Stock movement history
- Export functionality

### 6. User Management (Admin only)
- Create/Edit users
- Role assignment (Admin/Staff)
- Password management
- Activity monitoring

---

## 🔐 Security Features

1. **Authentication**
   - Secure login system
   - Password hashing (client-side demo)
   - Session management
   - Auto logout after timeout

2. **Authorization**
   - Role-based access control
   - Route protection
   - Permission checking on all operations
   - UI element visibility based on roles

3. **Session Management**
   - Auto-expiry after 1 hour
   - Remember me functionality
   - Secure logout
   - Session validation on each page

4. **Audit Trail**
   - Activity logging
   - User action tracking
   - Timestamp recording
   - Complete history

---

## 📱 Mobile Support

StockWise is fully responsive and optimized for:
- 📱 Smartphones (iOS & Android)
- 📱 Tablets
- 💻 Desktops
- 🖥️ Large screens

### Mobile Features
- Touch-optimized interface
- Responsive navigation
- Optimized layouts
- Fast performance

---

## 🆕 Recent Updates (v2.0)

### Production Cleanup
- ✅ Removed unused database folder (~25MB)
- ✅ Removed service worker (sw.js) and PWA manifest
- ✅ Removed unused enhancement features
- ✅ Cleaned all console.log statements
- ✅ Optimized project structure

### Role Changes
- ✅ Removed manager role completely
- ✅ Simplified to Admin & Staff roles only
- ✅ Staff now have view-only access to products/suppliers
- ✅ Staff retain full stock management capabilities

### New Features
- ✅ Low Stock Alerts Modal with quick actions
- ✅ Stock Movement added to admin navigation
- ✅ Simplified stock movement reasons
- ✅ Improved About section
- ✅ Enhanced user experience

---

## 🎯 Demo Credentials

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| Admin | `admin` | `password123` | Full Access - All CRUD operations |
| Staff | `staff` | `password123` | View products/suppliers, Manage stock |

---

## 🐛 Known Limitations

1. **Browser Storage Limit** - localStorage has ~5-10MB limit
2. **No Real-time Sync** - Data is local to each browser
3. **Demo Environment** - Use proper server-side authentication in production
4. **Single Device** - Data doesn't sync across devices

---

## 📈 Future Enhancements

### Planned Features
- [ ] Backend integration (Node.js/Express)
- [ ] Real database (MySQL/PostgreSQL)
- [ ] Multi-device sync
- [ ] Barcode scanning
- [ ] Email notifications
- [ ] Multi-warehouse support
- [ ] Advanced analytics with charts
- [ ] API integration
- [ ] Print labels
- [ ] Batch operations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔄 Version History

### v2.0.0 (2026-02-17)
- 🧹 Production cleanup - removed unused files and code
- 🔄 Role simplification - removed manager role
- ✨ New low stock alerts modal
- ⚡ Performance optimizations
- 📱 Mobile improvements
- 🎨 UI/UX enhancements

### v1.0.0 (2026-01-29)
- ✨ Initial release
- ✅ Core inventory management
- ✅ User authentication
- ✅ Reports and analytics
- ✅ Mobile responsive design

---

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

---

Made with ❤️ for efficient inventory management