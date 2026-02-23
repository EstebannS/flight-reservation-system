import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ResultsView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');

  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        // Simular datos de vuelos
        setTimeout(() => {
          const mockFlights = [
            {
              id: 1,
              airline: 'Avianca',
              flightNumber: 'AV123',
              departure: '08:00',
              arrival: '09:00',
              price: 250000,
              availableSeats: 32
            },
            {
              id: 2,
              airline: 'LATAM',
              flightNumber: 'LA456',
              departure: '10:30',
              arrival: '11:45',
              price: 230000,
              availableSeats: 18
            },
            {
              id: 3,
              airline: 'Viva Air',
              flightNumber: 'VH789',
              departure: '15:30',
              arrival: '16:45',
              price: 180000,
              availableSeats: 45
            }
          ];
          setFlights(mockFlights);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, [origin, destination, date]);

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'departure') return a.departure.localeCompare(b.departure);
    return 0;
  });

  const handleReserve = (flightId) => {
    navigate(`/reservation/${flightId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando vuelos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Vuelos de {origin} a {destination}
        </h1>
        <p className="text-gray-600 mt-2">Fecha: {new Date(date).toLocaleDateString('es-ES')}</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-700">{flights.length} vuelos encontrados</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="price">Ordenar por precio</option>
          <option value="departure">Ordenar por hora</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedFlights.map(flight => (
          <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">✈️</span>
                  <div>
                    <h3 className="font-bold text-lg">{flight.airline} - {flight.flightNumber}</h3>
                    <p className="text-gray-600">
                      {flight.departure} → {flight.arrival}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">${flight.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">por persona</p>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {flight.availableSeats} asientos disponibles
                  </span>
                </div>

                <button
                  onClick={() => handleReserve(flight.id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {flights.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No se encontraron vuelos para esta ruta</p>
        </div>
      )}
    </div>
  );
};

export default ResultsView;