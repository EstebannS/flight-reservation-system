// Datos de aeropuertos de Colombia
export const colombianAirports = [
  { code: 'BOG', city: 'Bogotá', name: 'Aeropuerto El Dorado', country: 'Colombia' },
  { code: 'MDE', city: 'Medellín', name: 'Aeropuerto José María Córdova', country: 'Colombia' },
  { code: 'CTG', city: 'Cartagena', name: 'Aeropuerto Rafael Núñez', country: 'Colombia' },
  { code: 'CLO', city: 'Cali', name: 'Aeropuerto Alfonso Bonilla Aragón', country: 'Colombia' },
  { code: 'BAQ', city: 'Barranquilla', name: 'Aeropuerto Ernesto Cortissoz', country: 'Colombia' },
  { code: 'BGA', city: 'Bucaramanga', name: 'Aeropuerto Palonegro', country: 'Colombia' },
  { code: 'PEI', city: 'Pereira', name: 'Aeropuerto Matecaña', country: 'Colombia' },
  { code: 'AXM', city: 'Armenia', name: 'Aeropuerto El Edén', country: 'Colombia' },
  { code: 'SMR', city: 'Santa Marta', name: 'Aeropuerto Simón Bolívar', country: 'Colombia' },
  { code: 'ADZ', city: 'San Andrés', name: 'Aeropuerto Gustavo Rojas Pinilla', country: 'Colombia' },
  { code: 'LET', city: 'Leticia', name: 'Aeropuerto Alfredo Vásquez Cobo', country: 'Colombia' },
  { code: 'VUP', city: 'Valledupar', name: 'Aeropuerto Alfonso López', country: 'Colombia' },
  { code: 'CUC', city: 'Cúcuta', name: 'Aeropuerto Camilo Daza', country: 'Colombia' },
  { code: 'IBE', city: 'Ibagué', name: 'Aeropuerto Perales', country: 'Colombia' },
  { code: 'MZL', city: 'Manizales', name: 'Aeropuerto La Nubia', country: 'Colombia' },
  { code: 'PZO', city: 'Puerto Ordaz', name: 'Aeropuerto Manuel Piar', country: 'Venezuela' },
];

// Opciones de clase
export const classOptions = [
  { id: 'economy', name: 'Económica', multiplier: 1.0, description: 'La opción más económica' },
  { id: 'premium', name: 'Económica Premium', multiplier: 1.3, description: 'Más espacio y comodidad' },
  { id: 'business', name: 'Ejecutiva', multiplier: 1.8, description: 'Asientos reclinables y sala VIP' },
  { id: 'first', name: 'Primera Clase', multiplier: 2.5, description: 'Lujo y exclusividad' }
];

// Opciones de equipaje
export const baggageOptions = [
  { id: 'none', name: 'Solo cabina', price: 0, description: '1 maleta de mano (10kg)' },
  { id: 'light', name: 'Equipaje ligero', price: 45000, description: '1 maleta de bodega (15kg)' },
  { id: 'medium', name: 'Equipaje mediano', price: 75000, description: '1 maleta de bodega (23kg)' },
  { id: 'heavy', name: 'Equipaje pesado', price: 120000, description: '1 maleta de bodega (30kg)' },
  { id: 'extra', name: 'Dos maletas', price: 180000, description: '2 maletas de bodega (23kg c/u)' }
];

// Opciones de comida
export const mealOptions = [
  { id: 'standard', name: 'Estándar', price: 0, description: 'Comida incluida' },
  { id: 'vegetarian', name: 'Vegetariana', price: 0, description: 'Opción sin carne' },
  { id: 'vegan', name: 'Vegana', price: 0, description: 'Opción sin productos animales' },
  { id: 'kids', name: 'Infantil', price: 0, description: 'Comida para niños' },
  { id: 'premium', name: 'Premium', price: 25000, description: 'Menú gourmet' }
];

// Opciones de seguro
export const insuranceOptions = [
  { id: 'none', name: 'Sin seguro', price: 0, description: 'Viaja sin protección adicional' },
  { id: 'basic', name: 'Básico', price: 25000, description: 'Cubre pérdida de equipaje y demoras' },
  { id: 'premium', name: 'Premium', price: 55000, description: 'Cubre cancelación, equipaje y asistencia médica' },
  { id: 'full', name: 'Completo', price: 95000, description: 'Cobertura total + COVID-19' }
];
