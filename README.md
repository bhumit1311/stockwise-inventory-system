# 📦 StockWise - Modern Inventory Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A professional, full-featured inventory management system built with modern web technologies. StockWise provides real-time tracking, comprehensive reporting, and role-based access control for efficient inventory management.

---

## 🌟 Features

### Core Functionality
- ✅ **Real-time Inventory Tracking** - Monitor stock levels in real-time
- ✅ **Product Management** - Add, edit, and manage products with ease
- ✅ **Supplier Management** - Track and manage supplier relationships
- ✅ **User Management** - Role-based access control (Admin, User, Staff)
- ✅ **Stock Movement Tracking** - Complete audit trail of all stock changes
- ✅ **Low Stock Alerts** - Automatic notifications for low inventory
- ✅ **Comprehensive Reports** - Detailed analytics and reporting
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- 📊 **Analytics Dashboard** - Visual charts and statistics
- 🔐 **Secure Authentication** - Session management with auto-expiry
- 📱 **Mobile Optimized** - Touch-friendly interface for mobile devices
- 🎨 **Modern UI/UX** - Clean, professional interface
- 💾 **Data Export** - Export reports to CSV/JSON
- 🔍 **Advanced Search** - Quick product and supplier lookup
- 📈 **Trend Analysis** - Track inventory trends over time
- ⚡ **Fast Performance** - Client-side data management for speed

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or database required - runs entirely in the browser!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stockwise.git
   cd stockwise
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Login with demo credentials**
   - See [Demo Credentials](#-demo-credentials) section below

---

## 👥 User Roles

### 🔴 Admin
**Full system access**
- Manage all products, suppliers, and users
- View all reports and analytics
- Access to system settings
- Complete audit trail access

**Default Credentials:**
- Username: `admin`
- Password: `password123`

### 🟢 Manager/User
**Inventory management**
- View and manage products
- View stock movements
- Generate reports
- Limited user management

**Default Credentials:**
- Username: `manager`
- Password: `password123`

### 🟡 Staff
**Basic operations**
- View products
- Update stock levels
- View basic reports

**Default Credentials:**
- Username: `staff`
- Password: `password123`

---

## 📁 Project Structure

```
stockwise/
├── index.html                 # Landing page
├── README.md                  # This file
├── TODO.md                    # Development tasks
├── .gitignore                 # Git ignore rules
│
├── css/                       # Stylesheets
│   ├── light-theme.css       # Main theme
│   └── mobile-fixes.css      # Mobile responsiveness
│
├── js/                        # JavaScript files
│   ├── auth/
│   │   └── authGuard.js      # Authentication guard
│   ├── services/
│   │   └── dataService.js    # Central data service
│   ├── utils/
│   │   └── uiUtils.js        # UI utilities
│   ├── database.js           # Client-side database
│   ├── login-page.js         # Login functionality
│   ├── register-page.js      # Registration
│   ├── admin-dashboard-page.js
│   ├── user-dashboard-page.js
│   ├── products-page.js
│   ├── suppliers-page.js
│   ├── users-page.js
│   ├── reports-page.js
│   ├── stock-movement-page.js
│   ├── profile-page.js
│   ├── settings-page.js
│   └── dashboard-enhancements.js
│
├── pages/                     # HTML pages
│   ├── login.html
│   ├── register.html
│   ├── admin-dashboard.html
│   ├── user-dashboard.html
│   ├── products.html
│   ├── suppliers.html
│   ├── users.html
│   ├── reports.html
│   ├── stock-movement.html
│   ├── profile.html
│   └── settings.html
│
├── components/                # Reusable components
│   └── navbar.html           # Navigation component
│
└── database/                  # Database documentation
    ├── schema.md             # Database schema
    ├── sample-data.json      # Sample data
    └── connection.php        # (Legacy - not used)
```

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Modern JavaScript features
- **Bootstrap 5.3** - Responsive framework
- **Font Awesome 6.0** - Icon library
- **Chart.js 4.4** - Data visualization

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
- Real-time statistics
- Visual charts and graphs
- Recent activity feed
- Low stock alerts
- Quick action buttons

### 2. Product Management
- Add/Edit/Delete products
- Category organization
- Stock level tracking
- Supplier assignment
- Bulk operations

### 3. Supplier Management
- Supplier database
- Contact information
- Product associations
- Status tracking

### 4. Reports & Analytics
- Inventory reports
- Supplier reports
- Low stock reports
- Stock movement history
- Export functionality

### 5. User Management (Admin only)
- Create/Edit users
- Role assignment
- Access control
- Activity monitoring

---

## 🔐 Security Features

1. **Authentication**
   - Secure login system
   - Password hashing (client-side demo)
   - Session management

2. **Authorization**
   - Role-based access control
   - Route protection
   - Permission checking

3. **Session Management**
   - Auto-expiry after 1 hour
   - Remember me functionality
   - Secure logout

4. **Audit Trail**
   - Activity logging
   - User action tracking
   - Timestamp recording

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
- Offline capability

---

## 🎨 Customization

### Themes
The system uses CSS custom properties for easy theming:

```css
:root {
    --bg-primary: #fdfcf9;
    --accent-primary: #5fb89a;
    --text-primary: #2d3436;
    /* ... more variables */
}
```

### Adding New Features
1. Create new page in `pages/`
2. Create corresponding JS file in `js/`
3. Add route to navigation
4. Update permissions in `authGuard.js`

---

## 📈 Future Enhancements

### Planned Features
- [ ] Backend integration (Node.js/PHP)
- [ ] Real database (MySQL/PostgreSQL)
- [ ] Barcode scanning
- [ ] Email notifications
- [ ] Multi-warehouse support
- [ ] Advanced analytics
- [ ] API integration
- [ ] Mobile app (React Native)
- [ ] Print labels
- [ ] Batch operations

### Backend Integration Roadmap
1. Set up Node.js/Express server
2. Implement MySQL database
3. Create REST API endpoints
4. Add JWT authentication
5. Implement file uploads
6. Add email service
7. Deploy to cloud

---

## 🐛 Known Issues

1. **Browser Storage Limit** - localStorage has ~5-10MB limit
2. **No Real-time Sync** - Data is local to each browser
3. **Demo Password Hashing** - Use proper server-side hashing in production

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**StockWise Team**
- Website: [stockwise.com](https://stockwise.com)
- Email: support@stockwise.com

---

## 🙏 Acknowledgments

- Bootstrap team for the amazing framework
- Font Awesome for the icon library
- Chart.js for data visualization
- All contributors and testers

---

## 📞 Support

For support, email support@stockwise.com or open an issue on GitHub.

---

## 🔄 Version History

### v1.0.0 (2026-01-29)
- ✨ Initial release
- ✅ Core inventory management
- ✅ User authentication
- ✅ Reports and analytics
- ✅ Mobile responsive design
- ✅ Complete documentation

---

## 🎯 Demo Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | `admin` | `password123` | Full Access |
| Manager | `manager` | `password123` | Inventory Management |
| Staff | `staff` | `password123` | Basic Operations |

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

---

Made with ❤️ by the StockWise Team