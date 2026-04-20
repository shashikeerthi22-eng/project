-- ══════════════════════════════════════════
--  RoadWay – MySQL Database Setup
--  Run this file once before starting server
-- ══════════════════════════════════════════

-- 1. Create database
CREATE DATABASE IF NOT EXISTS Roadway1;
USE Roadway1;

-- 2. Users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  phone      VARCHAR(30),
  role       ENUM('user','driver','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bookings table
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  pickup           VARCHAR(255)  NOT NULL,
  drop_location    VARCHAR(255)  NOT NULL,
  date             DATE          NOT NULL,
  time             TIME          NOT NULL,
  vehicle_type     VARCHAR(50)   NOT NULL,
  passengers       INT           DEFAULT 1,
  estimated_price  DECIMAL(10,2) DEFAULT 0,
  status           ENUM('pending','confirmed','ongoing','completed','cancelled') DEFAULT 'pending',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Drivers table
DROP TABLE IF EXISTS drivers;
CREATE TABLE drivers (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL UNIQUE,
  phone          VARCHAR(30)  NOT NULL,
  password       VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) NOT NULL UNIQUE,
  vehicle_type   VARCHAR(50)  NOT NULL,
  vehicle_number VARCHAR(50)  NOT NULL,
  status         ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Vehicles table
DROP TABLE IF EXISTS vehicles;
CREATE TABLE vehicles (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  driver_id        INT          NOT NULL,
  make_model       VARCHAR(150) NOT NULL,
  vehicle_type     VARCHAR(50)  NOT NULL,
  vehicle_number   VARCHAR(50)  NOT NULL,
  seating_capacity INT          NOT NULL,
  status           ENUM('active','inactive') DEFAULT 'active',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

-- ── Sample data (optional) ─────────────────
INSERT INTO users (name, email, password, role) VALUES
  ('Super Admin', 'admin@roadway.in', '$2b$10$7ME38AW47iqD7Q7FevptmuqbfUYO7wkzbCsHswmIRrqpFRtyknJvO', 'admin');

INSERT INTO bookings (pickup, drop_location, date, time, vehicle_type, passengers, estimated_price, status) VALUES
  ('Whitefield', 'Electronic City', '2025-12-25', '09:00:00', 'tt',     8, 450.00, 'completed'),
  ('Koramangala', 'Mysore',         '2025-12-20', '08:00:00', 'tempo', 11, 3200.00,'completed'),
  ('HSR Layout',  'Airport',        '2025-12-15', '06:00:00', 'car',    2, 560.00, 'completed'),
  ('MG Road',     'Goa',            '2025-12-12', '05:00:00', 'minibus',24,12000.00,'cancelled');
