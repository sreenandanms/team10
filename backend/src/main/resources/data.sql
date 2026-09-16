-- ===================================================
-- HOSTEL LAUNDRY MANAGEMENT SYSTEM - SEED DATA
-- Project Group Members & Approved Rates
-- ===================================================

USE laundry_db;

-- 1. Official Rates
INSERT IGNORE INTO laundry_prices (id, clothing_type, price_per_unit, active) VALUES
(1, 'Shirt', 10.0, true),
(2, 'Pant', 15.0, true),
(3, 'Bedsheet', 20.0, true),
(4, 'Towel', 8.0, true);

-- 2. Users & Students
INSERT IGNORE INTO users (id, name, phone) VALUES
(1, 'Sai Krishna', '9876543210'),
(2, 'Sanvin Sijo', '9876543211'),
(3, 'Savio Aji', '9876543212'),
(4, 'Shifa Sherin P', '9876543213');

INSERT IGNORE INTO students (id, student_id, room_number, department) VALUES
(1, 'STU001', 'A-101', 'CSE'),
(2, 'STU002', 'A-102', 'CSE'),
(3, 'STU003', 'A-103', 'CSE'),
(4, 'STU004', 'A-104', 'CSE');

-- 3. Staff
INSERT IGNORE INTO users (id, name, phone) VALUES
(5, 'Ramesh Kumar', '9876543220'),
(6, 'Anand P', '9876543221');

INSERT IGNORE INTO staff (id, staff_type) VALUES
(5, 'Laundry Supervisor'),
(6, 'Laundry Staff');
