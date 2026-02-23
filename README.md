# ✈️ SkyReserve - Sistema de Reserva de Vuelos

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema completo de reserva de vuelos desarrollado como prueba técnica para **INTOUCH CX COLOMBIA**. Aplicación web responsive con autenticación, búsqueda de vuelos, reserva multi-paso y simulación de pagos.

## 📋 Tabla de Contenidos
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requerimientos Funcionales](#-requerimientos-funcionales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [API Endpoints](#-api-endpoints)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Desarrollador](#-desarrollador)

## ✨ Características

- ✅ **Autenticación completa** - Registro, login y persistencia de sesión con JWT
- ✅ **Búsqueda de vuelos** - Con autocompletado de aeropuertos colombianos
- ✅ **Filtros avanzados** - Por precio, aerolínea, horario, escalas y clase
- ✅ **Proceso de reserva multi-paso** - Clase, equipaje, seguro y datos de pasajeros
- ✅ **Temporizador de 15 minutos** - Para completar la compra (Requerimiento R8)
- ✅ **Simulación de pago** - Integración con Wompi (modo prueba)
- ✅ **Confirmación por email** - Simulación de envío (Requerimiento R9)
- ✅ **Diseño responsive** - Adaptado a móviles, tablets y desktop
- ✅ **Interfaz profesional** - Estilo similar a aerolíneas como LATAM y Avianca

## 🛠️ Tecnologías

### Backend
- **Node.js** (v20+)
- **Express** - Framework web
- **MySQL** - Base de datos (via XAMPP)
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Joi** - Validación de datos
- **Nodemailer** - Simulación de emails

### Frontend
- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router v6** - Navegación
- **Tailwind CSS** - Estilos responsive
- **React Hot Toast** - Notificaciones
- **Font Awesome** - Iconos

### Base de Datos
- **MySQL 8.0** - Motor de base de datos
- **phpMyAdmin** - Gestión visual (opcional)

## 📊 Requerimientos Funcionales

| ID | Descripción | Estado |
|----|-------------|--------|
| R1 | Consultar vuelos | ✅ |
| R2 | Reservar vuelos | ✅ |
| R3 | Comprar billetes (simulado) | ✅ |
| R4 | Autenticación e ingreso | ✅ |
| R5 | Consultar tarifas | ✅ |
| R6 | Consultar información de vuelos | ✅ |
| R7 | Registro de usuario | ✅ |
| R8 | Inactividad 15 minutos | ✅ |
| R9 | Email de confirmación | ✅ |

## 📁 Estructura del Proyecto
flight-reservation-system/
├── 📂 backend/
│ ├── 📂 src/
│ │ ├── 📂 controllers/ # Lógica de negocio
│ │ ├── 📂 models/ # Modelos de datos
│ │ ├── 📂 routes/ # Endpoints de la API
│ │ ├── 📂 middleware/ # Autenticación, validación
│ │ ├── 📂 config/ # Configuración de BD
│ │ └── 📂 services/ # Email, pagos
│ ├── server.js # Punto de entrada
│ └── package.json
│
├── 📂 frontend/
│ ├── 📂 src/
│ │ ├── 📂 components/ # Componentes reutilizables
│ │ ├── 📂 views/ # Páginas completas
│ │ ├── 📂 context/ # Estado global (Auth)
│ │ ├── 📂 hooks/ # Custom hooks (inactividad)
│ │ ├── 📂 data/ # Datos de aeropuertos
│ │ └── 📂 utils/ # Utilidades
│ ├── index.html
│ └── package.json
│
└── 📂 database/
└── schema.sql # Script de base de datos
## 🚀 Instalación

### Prerrequisitos
- **Node.js** (v20 o superior) - [Descargar](https://nodejs.org/)
- **XAMPP** (MySQL) - [Descargar](https://www.apachefriends.org/)
- **Git** - [Descargar](https://git-scm.com/)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/EstebanSalazarPe/flight-reservation-system.git
   cd flight-reservation-system