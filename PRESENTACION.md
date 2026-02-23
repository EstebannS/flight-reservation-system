# 🎯 PRESENTACIÓN DE LA PRUEBA TÉCNICA

## Información del Candidato
- **Nombre:** Esteban Felipe Salazar Peña
- **Email:** estebannsalazar@gmail.com
- **Teléfono:** 3203489406
- **Fecha de entrega:** 23 de febrero de 2026

## 📋 Resumen de Implementación

Se ha desarrollado un sistema completo de reserva de vuelos que cumple con todos los requerimientos funcionales y no funcionales solicitados:

### ✅ Requerimientos Cumplidos
- **R1:** Consulta de vuelos con filtros avanzados
- **R2:** Reserva de vuelos multi-paso
- **R3:** Compra simulada con Wompi
- **R4:** Autenticación JWT con persistencia
- **R5:** Consulta de tarifas ordenadas por precio
- **R6:** Información detallada de vuelos
- **R7:** Registro de usuarios con encriptación
- **R8:** Temporizador de 15 minutos por inactividad
- **R9:** Simulación de email de confirmación

### 🎨 Diseño y UX
- Interfaz profesional similar a aerolíneas reales
- Diseño 100% responsive (móvil, tablet, desktop)
- Autocompletado de aeropuertos colombianos
- Flujo intuitivo de reserva en 3 pasos

### 🔧 Tecnologías Utilizadas
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MySQL
- **Autenticación:** JWT + bcrypt
- **Pagos:** Simulación con Wompi
- **Base de datos:** MySQL 8.0 (XAMPP)

### 🏗️ Arquitectura
- Patrón MVC (Modelo-Vista-Controlador)
- API RESTful
- Separación clara de responsabilidades

## 🚀 Cómo probar la aplicación

### Opción 1: Local (recomendado)
```bash
git clone https://github.com/EstebanSalazarPe/flight-reservation-system.git
cd flight-reservation-system

# Backend
cd backend
npm install
npm run dev

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev