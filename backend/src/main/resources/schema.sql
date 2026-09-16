-- ===================================================
-- HOSTEL LAUNDRY MANAGEMENT SYSTEM - DATABASE SCHEMA
-- MySQL Relational Database
-- ===================================================

CREATE DATABASE IF NOT EXISTS laundry_db;
USE laundry_db;

-- 1. Base Users Table (Inheritance: JOINED)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL
);

-- 2. Students Table (Extends users)
CREATE TABLE IF NOT EXISTS students (
    id BIGINT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    room_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    CONSTRAINT fk_student_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Staff Table (Extends users)
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT PRIMARY KEY,
    staff_type VARCHAR(100) NOT NULL,
    CONSTRAINT fk_staff_user FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Laundry Pricing Table
CREATE TABLE IF NOT EXISTS laundry_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    clothing_type VARCHAR(100) NOT NULL UNIQUE,
    price_per_unit DOUBLE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Laundry Orders Table
CREATE TABLE IF NOT EXISTS laundry_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    student_id BIGINT NOT NULL,
    total_amount DOUBLE NOT NULL DEFAULT 0.0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    notes VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_order_student FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 6. Laundry Order Items Table
CREATE TABLE IF NOT EXISTS laundry_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    clothing_type VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DOUBLE NOT NULL,
    subtotal DOUBLE NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES laundry_orders(id) ON DELETE CASCADE
);
