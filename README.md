# ✈️ SkyReserve - Sistema de Reserva de Vuelos

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

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
2. **Configurar la base de datos**

Iniciar XAMPP y activar MySQL

Abrir phpMyAdmin: http://localhost/phpmyadmin

Crear base de datos: flight_reservation

Importar el archivo database/schema.sql

3. **Configurar el backend**
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MySQL

4. **Configurar el frontend**
cd frontend
npm install

Variables de Entorno (backend/.env)
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=flight_reservation
JWT_SECRET=tu_clave_secreta_aqui


5. **Ejecución**

cd backend
npm run dev
# El servidor correrá en http://localhost:3000

cd frontend
npm run dev
# La aplicación correrá en http://localhost:5173

Usuarios de Prueba
json
{
  "email": "test@example.com",
  "password": "123456"
}

📡 API Endpoints
Autenticación
POST /api/auth/register - Registrar usuario

POST /api/auth/login - Iniciar sesión

GET /api/auth/verify - Verificar token

Vuelos
GET /api/flights/search?origin=BOG&destination=MDE&date=2024-03-20 - Buscar vuelos

GET /api/flights/:id - Obtener vuelo por ID

Reservas
POST /api/reservations - Crear reserva

GET /api/reservations/my-reservations - Mis reservas

POST /api/reservations/:id/confirm-payment - Confirmar pago

**👨‍💻 Desarrollador**
Esteban Felipe Salazar Peña

📧 Email: estebannsalazar@gmail.com

📱 Teléfono: 3203489406

💼 LinkedIn: [Esteban Salazar](https://www.linkedin.com/in/esteban-salazar-a3273b205/)

Sobre el Desarrollo
Este proyecto fue desarrollado como prueba técnica para INTOUCH CX COLOMBIA. Se implementó siguiendo las mejores prácticas de desarrollo de software:

Arquitectura MVC - Separación clara de responsabilidades

Código limpio - Nomenclatura consistente y comentarios

UX/UI profesional - Diseño responsive similar a aerolíneas reales

Seguridad - Contraseñas encriptadas, JWT, validaciones

Documentación - README completo y comentarios en código

📝 Licencia
Este proyecto es de uso exclusivo para evaluación técnica.

**¡Gracias por revisar mi trabajo! 🚀**

**✈️ SkyReserve - Vuela por Colombia con la mejor experiencia**
