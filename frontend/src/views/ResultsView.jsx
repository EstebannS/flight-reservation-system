import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResultsView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');

  // Filtros
  const [filters, setFilters] = useState({
    airlines: [],
    maxPrice: 1000000,
    departureTime: 'any',
    stops: 'any',
    class: 'economy'
  });

  const origin = searchParams.get('origin') || 'BOG';
  const destination = searchParams.get('destination') || 'MDE';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  // Aerolíneas disponibles
  const airlines = ['Avianca', 'LATAM', 'Viva Air', 'Wingo', 'EasyFly'];

  useEffect(() => {
    fetchFlights();
  }, [origin, destination, date]);

  useEffect(() => {
    applyFilters();
  }, [flights, filters, sortBy]);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      // Simular llamada a API
      setTimeout(() => {
        const mockFlights = [
          {
            id: 1,
            airline: 'Avianca',
            flightNumber: 'AV123',
            departure: '08:00',
            arrival: '09:00',
            price: 250000,
            availableSeats: 32,
            stops: 0,
            duration: 60,
            class: 'economy'
          },
          {
            id: 2,
            airline: 'LATAM',
            flightNumber: 'LA456',
            departure: '10:30',
            arrival: '11:45',
            price: 230000,
            availableSeats: 18,
            stops: 1,
            duration: 75,
            class: 'economy'
          },
          {
            id: 3,
            airline: 'Viva Air',
            flightNumber: 'VH789',
            departure: '15:30',
            arrival: '16:45',
            price: 180000,
            availableSeats: 45,
            stops: 0,
            duration: 75,
            class: 'economy'
          },
          {
            id: 4,
            airline: 'Avianca',
            flightNumber: 'AV456',
            departure: '18:00',
            arrival: '19:15',
            price: 320000,
            availableSeats: 8,
            stops: 0,
            duration: 75,
            class: 'business'
          },
          {
            id: 5,
            airline: 'Wingo',
            flightNumber: 'WG789',
            departure: '06:30',
            arrival: '07:45',
            price: 150000,
            availableSeats: 52,
            stops: 0,
            duration: 75,
            class: 'economy'
          },
          {
            id: 6,
            airline: 'EasyFly',
            flightNumber: 'EF123',
            departure: '20:00',
            arrival: '21:15',
            price: 165000,
            availableSeats: 28,
            stops: 0,
            duration: 75,
            class: 'economy'
          }
        ];
        setFlights(mockFlights);
        setFilteredFlights(mockFlights);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...flights];

    // Filtrar por aerolínea
    if (filters.airlines.length > 0) {
      filtered = filtered.filter(f => filters.airlines.includes(f.airline));
    }

    // Filtrar por precio máximo
    filtered = filtered.filter(f => f.price <= filters.maxPrice);

    // Filtrar por hora de salida
    if (filters.departureTime !== 'any') {
      filtered = filtered.filter(f => {
        const hour = parseInt(f.departure.split(':')[0]);
        if (filters.departureTime === 'morning') return hour >= 6 && hour < 12;
        if (filters.departureTime === 'afternoon') return hour >= 12 && hour < 18;
        if (filters.departureTime === 'night') return hour >= 18 || hour < 6;
        return true;
      });
    }

    // Filtrar por escalas
    if (filters.stops !== 'any') {
      if (filters.stops === 'direct') {
        filtered = filtered.filter(f => f.stops === 0);
      } else if (filters.stops === '1stop') {
        filtered = filtered.filter(f => f.stops === 1);
      }
    }

    // Filtrar por clase
    if (filters.class !== 'all') {
      filtered = filtered.filter(f => f.class === filters.class);
    }

    // Ordenar
    if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'departure') {
      filtered.sort((a, b) => a.departure.localeCompare(b.departure));
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => a.duration - b.duration);
    }

    setFilteredFlights(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAirlineToggle = (airline) => {
    setFilters(prev => {
      const newAirlines = prev.airlines.includes(airline)
        ? prev.airlines.filter(a => a !== airline)
        : [...prev.airlines, airline];
      return { ...prev, airlines: newAirlines };
    });
  };

  const handleReserve = (flightId) => {
    navigate(`/reservation/${flightId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando los mejores vuelos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {origin} → {destination}
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date(date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>

            {/* Precio máximo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio máximo: ${filters.maxPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$1,000,000</span>
              </div>
            </div>

            {/* Aerolíneas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Aerolíneas</h3>
              {airlines.map(airline => (
                <label key={airline} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={filters.airlines.includes(airline)}
                    onChange={() => handleAirlineToggle(airline)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{airline}</span>
                </label>
              ))}
            </div>

            {/* Horario de salida */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Horario de salida</h3>
              <select
                value={filters.departureTime}
                onChange={(e) => handleFilterChange('departureTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="any">Cualquier hora</option>
                <option value="morning">Mañana (6am - 12pm)</option>
                <option value="afternoon">Tarde (12pm - 6pm)</option>
                <option value="night">Noche (6pm - 6am)</option>
              </select>
            </div>

            {/* Escalas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Escalas</h3>
              <select
                value={filters.stops}
                onChange={(e) => handleFilterChange('stops', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="any">Cualquier escala</option>
                <option value="direct">Vuelos directos</option>
                <option value="1stop">1 escala</option>
              </select>
            </div>

            {/* Clase */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Clase</h3>
              <select
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="all">Todas las clases</option>
                <option value="economy">Económica</option>
                <option value="business">Ejecutiva</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:w-3/4">
          {/* Ordenamiento y contador */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {filteredFlights.length} vuelos encontrados
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="price">Precio: menor a mayor</option>
              <option value="departure">Hora de salida</option>
              <option value="duration">Duración</option>
            </select>
          </div>

          {/* Lista de vuelos */}
          <div className="space-y-4">
            {filteredFlights.map(flight => (
              <div key={flight.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200">
                <div className="p-6">
                  {/* Header de aerolínea */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">✈️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{flight.airline}</h3>
                        <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                      </div>
                    </div>
                    {flight.availableSeats < 10 && (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        ¡Últimos {flight.availableSeats} asientos!
                      </span>
                    )}
                  </div>

                  {/* Información del vuelo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.departure}</p>
                      <p className="text-sm text-gray-500">{origin}</p>
                    </div>

                    <div className="flex-1 mx-4">
                      <div className="relative">
                        <div className="border-t-2 border-gray-300 absolute w-full top-1/2"></div>
                        <div className="flex justify-between relative -top-2">
                          <span className="bg-gray-300 w-2 h-2 rounded-full"></span>
                          <span className="bg-gray-300 w-2 h-2 rounded-full"></span>
                          <span className="bg-gray-300 w-2 h-2 rounded-full"></span>
                        </div>
                      </div>
                      <p className="text-center text-xs text-gray-500 mt-1">
                        {flight.stops === 0 ? 'Directo' : `1 escala`} · {flight.duration} min
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{flight.arrival}</p>
                      <p className="text-sm text-gray-500">{destination}</p>
                    </div>
                  </div>

                  {/* Footer con precio y acción */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500">Desde</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${flight.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">por persona</p>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => handleReserve(flight.id)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
                      >
                        Reservar
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        {flight.availableSeats} asientos disponibles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFlights.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No se encontraron vuelos con estos filtros</p>
              <button
                onClick={() => setFilters({
                  airlines: [],
                  maxPrice: 1000000,
                  departureTime: 'any',
                  stops: 'any',
                  class: 'all'
                })}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;