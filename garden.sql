/*
 Navicat Premium Dump SQL

 Source Server         : mobile
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : garden

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 16/12/2025 18:18:00
*/

DROP DATABASE IF EXISTS garden;

CREATE DATABASE garden
USE garden;

-- USER
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    role ENUM('customer','admin') DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    common_name VARCHAR(255),
    scientific_name VARCHAR(255),
    product_spec TEXT,
    description TEXT,
    product_type ENUM('plant','pot','accessory') NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    sale_price DECIMAL(12,2),
    stock INT DEFAULT 0,
    image VARCHAR(255),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    parent_id INT NULL,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE
);

-- ATTRIBUTES
CREATE TABLE IF NOT EXISTS attribute_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES attribute_groups(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_attributes (
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    PRIMARY KEY (product_id, attribute_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
        ON DELETE CASCADE
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
);

-- BLOG POSTS
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content LONGTEXT,
    author_id INT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
        ON DELETE SET NULL
);

-- CONTACTS
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LOCATION (PROVINCES / DISTRICTS / WARDS)
CREATE TABLE IF NOT EXISTS provinces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE
);

CREATE TABLE IF NOT EXISTS districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10),
    province_id INT NOT NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10),
    district_id INT NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id)
        ON DELETE CASCADE
);

-- PAYMENT
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,   -- cod, vnpay, momo
    name VARCHAR(255) NOT NULL,          -- Thanh toán khi nhận hàng
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_phone VARCHAR(50) NOT NULL,
    address_line VARCHAR(255),
    ward_id INT,
    district_id INT,
    province_id INT,
    full_address TEXT,
    note TEXT,
    payment_method_id INT NOT NULL,
    payment_status ENUM('unpaid','paid','failed','refunded') DEFAULT 'unpaid',
    shipping_fee DECIMAL(12,2) DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending','paid','shipped','completed','cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (ward_id) REFERENCES wards(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);


-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- WISHLIST
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
);

-- CARTS
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    session_id VARCHAR(255),
    status ENUM('active','converted') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- PRODUCT BUNDLES
-- CREATE TABLE IF NOT EXISTS product_bundles (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     main_product_id INT NOT NULL,
--     bundle_product_id INT NOT NULL,
--     extra_price DECIMAL(12,2) DEFAULT 0,
--     FOREIGN KEY (main_product_id) REFERENCES products(id)
--         ON DELETE CASCADE,
--     FOREIGN KEY (bundle_product_id) REFERENCES products(id)
--         ON DELETE CASCADE
-- );
