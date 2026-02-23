@echo off
echo ========================================
echo ✈️  SISTEMA DE RESERVA DE VUELOS
echo ========================================
echo.

echo 1. Verificando XAMPP...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if %errorlevel% NEQ 0 (
    echo ⚠️  MySQL no está corriendo. Por favor inicia MySQL desde XAMPP.
) else (
    echo ✅ MySQL está corriendo
)

echo.
echo 2. Iniciando BACKEND...
start cmd /k "cd backend && npm run dev"

echo.
echo 3. Iniciando FRONTEND...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo ✅ APLICACIÓN INICIADA
echo ========================================
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3000
echo.
echo Presiona cualquier tecla para salir...
pause >nul 