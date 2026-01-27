# StockWise - Inventory & Supplier Management System

## 🎨 Unique Mint Green Light Theme

StockWise features a **fresh, modern light theme** with a unique mint green color palette that stands out from typical business applications.

### Key Design Features:

#### 🌿 Unique Color Palette
- **Soft Cream Backgrounds**: Warm, inviting base colors (#fdfcf9, #f0f7f4)
- **Mint Green Primary**: Fresh, professional accent (#5fb89a)
- **Lavender Secondary**: Elegant complement (#9b87d4)
- **Coral Warning**: Soft, approachable alerts (#ffb088)
- **Soft Pink Danger**: Gentle error states (#ff8b94)
- **Aqua Info**: Calming information color (#7ec4cf)

#### ✨ Modern Design Elements
- **Smooth Transitions**: Polished interactions throughout
- **Hover Effects**: Cards lift with subtle shadows
- **Rounded Corners**: Soft, friendly interface
- **Gradient Accents**: Subtle depth and dimension
- **Clean Typography**: Easy-to-read, professional fonts

#### 🎯 Visual Enhancements
- **Soft Shadows**: Multi-layered depth effects
- **Subtle Animations**: Smooth, non-intrusive transitions
- **Consistent Spacing**: Balanced, harmonious layout
- **Accessible Colors**: High contrast for readability
- **Professional Polish**: Enterprise-grade appearance

---

## 🚀 Features

### 1. 📦 Product Management
- **Complete CRUD Operations**: Add, edit, view, and delete products
- **Real-Time Search**: Instant filtering across multiple fields
- **Category Organization**: Organize products by categories
- **Stock Tracking**: Monitor current and minimum stock levels
- **Supplier Integration**: Link products to suppliers
- **Low Stock Alerts**: Automatic notifications for low inventory

### 2. 🚚 Supplier Management
- **Supplier Database**: Maintain detailed supplier information
- **Contact Management**: Store contact persons and details
- **Status Tracking**: Active/inactive supplier management
- **Product Relationships**: View products by supplier

### 3. 👥 User Management (Admin)
- **Role-Based Access**: Admin, Manager, Staff, User roles
- **User Accounts**: Create and manage user accounts
- **Activity Tracking**: Monitor user actions
- **Secure Authentication**: Password-protected access

### 4. 📊 Stock Movement Tracking
- **Transaction History**: Complete audit trail
- **In/Out Tracking**: Monitor stock additions and removals
- **Reference Numbers**: Link to purchase/sales orders
- **User Attribution**: Track who made changes
- **Detailed Notes**: Add context to transactions

### 5. 📈 Reports & Analytics
- **Inventory Reports**: Current stock status
- **Stock Movement Reports**: Transaction history
- **Low Stock Reports**: Items needing reorder
- **Supplier Reports**: Performance metrics
- **Export Functionality**: Download reports as CSV

### 6. ⚙️ Settings & Profile
- **User Profile**: Manage personal information
- **System Settings**: Configure application preferences
- **Theme Customization**: Personalize appearance
- **Notification Preferences**: Control alerts

---

## 📁 Project Structure

```
stockwise-inventory-system/
├── index.html                          # Landing page
├── README.md                           # Documentation
├── TODO.md                             # Task tracking
├── .gitignore                          # Git ignore rules
├── css/
│   └── light-theme.css                 # Unique mint green theme
├── js/
│   ├── database.js                     # Client-side database (localStorage)
│   ├── dashboard-enhancements.js       # Advanced features
│   ├── admin-dashboard-page.js         # Admin dashboard logic
│   ├── user-dashboard-page.js          # User dashboard logic
│   ├── products-page.js                # Product management
│   ├── suppliers-page.js               # Supplier management
│   ├── users-page.js                   # User management
│   ├── stock-movement-page.js          # Stock tracking
│   ├── reports-page.js                 # Reports generation
│   ├── login-page.js                   # Authentication
│   ├── register-page.js                # User registration
│   ├── profile-page.js                 # User profile
│   └── settings-page.js                # System settings
└── pages/
    ├── admin-dashboard.html            # Admin dashboard
    ├── user-dashboard.html             # User dashboard
    ├── login.html                      # Login page
    ├── register.html                   # Registration page
    ├── products.html                   # Product management
    ├── suppliers.html                  # Supplier management
    ├── users.html                      # User management (admin)
    ├── stock-movement.html             # Stock tracking
    ├── reports.html                    # Reports & analytics
    ├── profile.html                    # User profile
    └── settings.html                   # System settings
```

---

## 🎨 Color Palette

### Primary Colors
```css
--accent-primary: #5fb89a;      /* Mint Green - Primary actions */
--accent-secondary: #9b87d4;    /* Lavender - Secondary elements */
--accent-success: #6ec9a8;      /* Success states */
--accent-warning: #ffb088;      /* Warning states */
--accent-danger: #ff8b94;       /* Error states */
--accent-info: #7ec4cf;         /* Information */
```

### Background Colors
```css
--bg-primary: #fdfcf9;          /* Main background */
--bg-secondary: #f0f7f4;        /* Secondary background */
--bg-card: #ffffff;             /* Card background */
--bg-hover: #e8f5f0;            /* Hover states */
```

### Text Colors
```css
--text-primary: #2d3436;        /* Primary text */
--text-secondary: #636e72;      /* Secondary text */
--text-muted: #95a5a6;          /* Muted text */
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhumit1311/stockwise-inventory-system.git
   cd stockwise-inventory-system
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`

3. **Start using**
   - Register a new account or use demo credentials
   - Explore the dashboard and features!

### Demo Credentials

```
Admin Account:
Username: admin
Password: password123

Manager Account:
Username: manager
Password: password123

Staff Account:
Username: staff
Password: password123

User Account:
Username: user
Password: password123
```

---

## 💡 Key Features

### Client-Side Database
- **No Backend Required**: Uses localStorage for data persistence
- **Sample Data Included**: Pre-populated with demo products and suppliers
- **Full CRUD Operations**: Complete database functionality
- **Activity Logging**: Tracks all user actions
- **Data Export/Import**: Backup and restore functionality

### Real-Time Features
- **Live Search**: Instant filtering as you type
- **Auto-Save**: Changes saved immediately
- **Notifications**: Toast notifications for actions
- **Dynamic Updates**: UI updates in real-time

### User Experience
- **Responsive Design**: Works on all devices
- **Intuitive Navigation**: Easy to find features
- **Keyboard Shortcuts**: Efficient navigation
- **Form Validation**: Helpful error messages
- **Loading States**: Clear feedback during operations

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 992px
- **Desktop**: 992px - 1200px
- **Large Desktop**: > 1200px

### Mobile Features
- Touch-friendly interface
- Collapsible navigation
- Optimized layouts
- Responsive tables
- Mobile-first approach

---

## 🔒 Security Features

- Password hashing (client-side demo)
- Role-based access control
- Session management
- Activity logging
- Secure authentication flow

**Note**: This is a demo application. For production use, implement proper server-side security.

---

## 🐛 Browser Support

### Fully Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features Used
- CSS Grid & Flexbox
- CSS Variables
- LocalStorage API
- ES6+ JavaScript
- Bootstrap 5

---

## 🎯 Performance

### Optimizations
- Minimal dependencies
- Efficient DOM manipulation
- Debounced search
- Lazy loading
- Optimized animations
- Clean, maintainable code

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Bootstrap 5**: Responsive framework
- **Font Awesome 6**: Icon library
- **Google Fonts**: Typography

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [Report a Bug](https://github.com/bhumit1311/stockwise-inventory-system/issues)
- 💡 [Request a Feature](https://github.com/bhumit1311/stockwise-inventory-system/issues)
- 📧 Contact: bhumitvaghela71@gmail.com

---

## 🎉 What Makes This Special

### Unique Design
- **Not Another Blue Theme**: Fresh mint green palette
- **Professional Yet Friendly**: Perfect balance
- **Modern & Clean**: Contemporary design language
- **Attention to Detail**: Polished interactions

### Complete Solution
- **No Backend Needed**: Runs entirely in browser
- **Sample Data Included**: Ready to explore
- **Full Feature Set**: Everything you need
- **Well Documented**: Easy to understand and modify

### Production Ready
- **Clean Code**: Well-organized and commented
- **Best Practices**: Modern development standards
- **Responsive**: Works everywhere
- **Accessible**: WCAG compliant colors

---

**Built with 💚 for modern inventory management**

*Repository: https://github.com/bhumit1311/stockwise-inventory-system*

*Last Updated: January 27, 2026*