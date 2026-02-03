-- StockWise Inventory Management System
-- MySQL Database Dump
-- Generated on: 2026-02-03

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stockwise_db`
--
CREATE DATABASE IF NOT EXISTS `stockwise_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `stockwise_db`;

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_users`
--

CREATE TABLE `stockwise_users` (
  `id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','user','staff') NOT NULL DEFAULT 'user',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockwise_users`
--

INSERT INTO `stockwise_users` (`id`, `username`, `email`, `password`, `full_name`, `role`, `status`, `created_at`, `last_login`) VALUES
('user_admin_001', 'admin', 'admin@stockwise.com', 'hash_16782', 'System Administrator', 'admin', 'active', '2026-01-01 10:00:00', NULL),
('user_manager_001', 'manager', 'manager@stockwise.com', 'hash_16782', 'Store Manager', 'user', 'active', '2026-01-01 10:00:00', NULL),
('user_staff_001', 'staff', 'staff@stockwise.com', 'hash_16782', 'Staff Member', 'staff', 'active', '2026-01-01 10:00:00', NULL),
('user_regular_001', 'user', 'user@stockwise.com', 'hash_16782', 'Regular User', 'user', 'active', '2026-01-01 10:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_categories`
--

CREATE TABLE `stockwise_categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockwise_categories`
--

INSERT INTO `stockwise_categories` (`id`, `name`, `description`, `status`, `created_at`) VALUES
('cat_elec_001', 'Electronics', 'Electronic devices and components', 'active', '2026-01-01 10:00:00'),
('cat_clth_001', 'Clothing', 'Apparel and fashion items', 'active', '2026-01-01 10:00:00'),
('cat_book_001', 'Books', 'Books and educational materials', 'active', '2026-01-01 10:00:00'),
('cat_home_001', 'Home & Garden', 'Home improvement and garden supplies', 'active', '2026-01-01 10:00:00'),
('cat_sprt_001', 'Sports', 'Sports equipment and accessories', 'active', '2026-01-01 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_suppliers`
--

CREATE TABLE `stockwise_suppliers` (
  `id` varchar(50) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockwise_suppliers`
--

INSERT INTO `stockwise_suppliers` (`id`, `supplier_name`, `contact_person`, `email`, `phone`, `address`, `status`, `created_at`) VALUES
('sup_tech_001', 'TechCorp Solutions', 'John Smith', 'john@techcorp.com', '+91-9876543210', '123 Tech Street, Mumbai, Maharashtra', 'active', '2026-01-01 10:00:00'),
('sup_fash_001', 'Fashion Hub Ltd', 'Sarah Johnson', 'sarah@fashionhub.com', '+91-9876543211', '456 Fashion Avenue, Delhi', 'active', '2026-01-01 10:00:00'),
('sup_book_001', 'BookWorld Publishers', 'Michael Brown', 'michael@bookworld.com', '+91-9876543212', '789 Knowledge Lane, Bangalore, Karnataka', 'active', '2026-01-01 10:00:00'),
('sup_elec_001', 'Electronics Mart', 'David Lee', 'david@electronicsmart.com', '+91-9876543213', '321 Electronics Plaza, Pune, Maharashtra', 'active', '2026-01-01 10:00:00'),
('sup_sprt_001', 'Sports Equipment Co', 'Emma Wilson', 'emma@sportsequip.com', '+91-9876543214', '654 Sports Complex, Chennai, Tamil Nadu', 'active', '2026-01-01 10:00:00'),
('sup_home_001', 'Home Decor Plus', 'Robert Taylor', 'robert@homedecor.com', '+91-9876543215', '987 Decor Street, Hyderabad, Telangana', 'active', '2026-01-01 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_products`
--

CREATE TABLE `stockwise_products` (
  `id` varchar(50) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `product_code` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `supplier_id` varchar(50) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `current_stock` int(11) NOT NULL DEFAULT '0',
  `minimum_stock` int(11) NOT NULL DEFAULT '0',
  `unit` varchar(20) DEFAULT 'piece',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `fk_product_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `stockwise_suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockwise_products`
--

INSERT INTO `stockwise_products` (`id`, `product_name`, `product_code`, `category`, `supplier_id`, `unit_price`, `current_stock`, `minimum_stock`, `unit`, `status`, `created_at`) VALUES
('prod_elec_001', 'Laptop Dell Inspiron 15', 'ELEC-001', 'Electronics', 'sup_tech_001', 45000.00, 25, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_002', 'HP Laptop ProBook 450', 'ELEC-002', 'Electronics', 'sup_tech_001', 52000.00, 18, 5, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_003', 'Wireless Mouse Logitech', 'ELEC-003', 'Electronics', 'sup_tech_001', 1500.00, 50, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_004', 'Mechanical Keyboard RGB', 'ELEC-004', 'Electronics', 'sup_tech_001', 3500.00, 8, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_005', 'USB-C Hub 7-in-1', 'ELEC-005', 'Electronics', 'sup_tech_001', 2200.00, 35, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_elec_006', 'Webcam HD 1080p', 'ELEC-006', 'Electronics', 'sup_tech_001', 4500.00, 22, 8, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_001', 'Cotton T-Shirt Blue', 'CLTH-001', 'Clothing', 'sup_fash_001', 500.00, 100, 30, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_clth_002', 'Denim Jeans Regular Fit', 'CLTH-002', 'Clothing', 'sup_fash_001', 1200.00, 65, 20, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_book_001', 'JavaScript Complete Guide', 'BOOK-001', 'Books', 'sup_book_001', 800.00, 30, 10, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_home_001', 'LED Desk Lamp', 'HOME-001', 'Home & Garden', 'sup_tech_001', 1200.00, 40, 15, 'piece', 'active', '2026-01-15 10:00:00'),
('prod_sprt_001', 'Yoga Mat Premium', 'SPRT-001', 'Sports', 'sup_fash_001', 1200.00, 35, 15, 'piece', 'active', '2026-01-15 10:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_stock_logs`
--

CREATE TABLE `stockwise_stock_logs` (
  `id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `transaction_type` enum('in','out') NOT NULL,
  `quantity` int(11) NOT NULL,
  `previous_stock` int(11) NOT NULL,
  `new_stock` int(11) NOT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `reason` varchar(50) DEFAULT NULL,
  `notes` text,
  `user_id` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_log_product` FOREIGN KEY (`product_id`) REFERENCES `stockwise_products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `stockwise_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stockwise_stock_logs`
--

INSERT INTO `stockwise_stock_logs` (`id`, `product_id`, `transaction_type`, `quantity`, `previous_stock`, `new_stock`, `reference`, `reason`, `notes`, `user_id`, `created_at`) VALUES
('log_001', 'prod_elec_001', 'in', 10, 15, 25, 'PO-2026-001', 'purchase', 'New stock arrival from supplier', 'user_admin_001', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('log_002', 'prod_elec_002', 'in', 8, 10, 18, 'PO-2026-002', 'purchase', 'Restocking HP laptops', 'user_admin_001', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('log_003', 'prod_elec_003', 'out', 15, 65, 50, 'SO-2026-001', 'sale', 'Sold to corporate client', 'user_staff_001', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- --------------------------------------------------------

--
-- Table structure for table `stockwise_activity_logs`
--

CREATE TABLE `stockwise_activity_logs` (
  `id` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `table_name` varchar(50) NOT NULL,
  `record_id` varchar(50) DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
