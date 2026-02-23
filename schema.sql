-- =====================================================
-- SISTEMA DE RESERVA DE VUELOS - SKYRESERVE
-- Script completo de base de datos
-- Desarrollado por: Esteban Felipe Salazar Peña
-- Fecha: 22 de Febrero 2026
-- =====================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS flight_reservation;
USE flight_reservation;

-- =====================================================
-- 1. TABLA DE USUARIOS
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    document_type ENUM('CC', 'CE', 'PASSPORT') DEFAULT 'CC',
    document_number VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT true,
    INDEX idx_email (email)
);

-- =====================================================
-- 2. TABLA DE AEROLÍNEAS
-- =====================================================
CREATE TABLE airlines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. TABLA DE VUELOS
-- =====================================================
CREATE TABLE flights (
    id INT PRIMARY KEY AUTO_INCREMENT,
    airline_id INT NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT,
    aircraft_type VARCHAR(50),
    total_seats INT DEFAULT 150,
    base_price DECIMAL(10, 2) NOT NULL,
    status ENUM('ON_TIME', 'DELAYED', 'CANCELLED') DEFAULT 'ON_TIME',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_id) REFERENCES airlines(id),
    INDEX idx_route (origin, destination),
    INDEX idx_departure (departure_time),
    UNIQUE KEY unique_flight (airline_id, flight_number, departure_time)
);

-- =====================================================
-- 4. TABLA DE ASIENTOS
-- =====================================================
CREATE TABLE seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    flight_id INT NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    class ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST') DEFAULT 'ECONOMY',
    is_available BOOLEAN DEFAULT true,
    price_modifier DECIMAL(3,2) DEFAULT 1.0,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (flight_id, seat_number),
    INDEX idx_availability (flight_id, is_available)
);

-- =====================================================
-- 5. TABLA DE MÉTODOS DE PAGO
-- =====================================================
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_wompi VARCHAR(255),
    last_four VARCHAR(4),
    card_holder VARCHAR(100),
    brand VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

-- =====================================================
-- 6. TABLA DE RESERVAS
-- =====================================================
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    reservation_code VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    extras JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_expires (expires_at)
);

-- =====================================================
-- 7. TABLA DE DETALLES DE RESERVA
-- =====================================================
CREATE TABLE reservation_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL,
    flight_id INT NOT NULL,
    seat_id INT NULL,
    passenger_name VARCHAR(150) NOT NULL,
    passenger_document VARCHAR(20),
    passenger_type ENUM('ADULT', 'CHILD', 'INFANT') DEFAULT 'ADULT',
    price_at_booking DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id),
    INDEX idx_reservation (reservation_id)
);

-- =====================================================
-- 8. TABLA DE TRANSACCIONES
-- =====================================================
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT NOT NULL UNIQUE,
    wompi_transaction_id VARCHAR(100),
    reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'COP',
    status ENUM('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR') DEFAULT 'PENDING',
    payment_method_type VARCHAR(50),
    wompi_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id),
    INDEX idx_status (status),
    INDEX idx_reference (reference)
);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar aerolíneas
INSERT INTO airlines (code, name, country) VALUES
('AV', 'Avianca', 'Colombia'),
('LA', 'LATAM Airlines', 'Chile'),
('VH', 'Viva Air', 'Colombia'),
('WK', 'Wingo', 'Colombia'),
('EF', 'EasyFly', 'Colombia');

-- Insertar vuelos de prueba
INSERT INTO flights (airline_id, flight_number, origin, destination, departure_time, arrival_time, base_price) VALUES
(1, 'AV123', 'BOG', 'MDE', '2024-03-20 08:00:00', '2024-03-20 09:00:00', 250000),
(1, 'AV456', 'BOG', 'CTG', '2024-03-20 10:30:00', '2024-03-20 12:00:00', 350000),
(2, 'LA789', 'MDE', 'BOG', '2024-03-20 15:00:00', '2024-03-20 16:00:00', 230000),
(3, 'VH001', 'CTG', 'BOG', '2024-03-21 09:00:00', '2024-03-21 10:30:00', 180000),
(4, 'WK123', 'BOG', 'SMR', '2024-03-21 11:00:00', '2024-03-21 12:30:00', 220000),
(5, 'EF456', 'BOG', 'ADZ', '2024-03-22 07:00:00', '2024-03-22 09:30:00', 320000);

-- Insertar asientos para cada vuelo (ejemplo para vuelo 1)
INSERT INTO seats (flight_id, seat_number, class, is_available, price_modifier) VALUES
(1, '1A', 'BUSINESS', true, 1.8),
(1, '1B', 'BUSINESS', true, 1.8),
(1, '1C', 'BUSINESS', true, 1.8),
(1, '2A', 'ECONOMY', true, 1.0),
(1, '2B', 'ECONOMY', true, 1.0),
(1, '2C', 'ECONOMY', true, 1.0),
(1, '3A', 'ECONOMY', true, 1.0),
(1, '3B', 'ECONOMY', true, 1.0),
(1, '3C', 'ECONOMY', true, 1.0);

-- Insertar usuario de prueba (contraseña: 123456)
INSERT INTO users (email, password_hash, full_name, document_number, phone) VALUES
('test@example.com', '.MrLQqYqJhFJxYQ5qJhFJxYQ5qJhFJxY', 'Usuario Test', '12345678', '3001234567');

-- Mostrar resultados
SELECT '✅ Base de datos creada exitosamente' as 'Mensaje';
SELECT COUNT(*) as 'Total Aerolíneas' FROM airlines;
SELECT COUNT(*) as 'Total Vuelos' FROM flights;
