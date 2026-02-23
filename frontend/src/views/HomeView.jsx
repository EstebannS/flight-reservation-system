import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportAutocomplete from '../components/AirportAutocomplete';

const HomeView = () => {
  const navigate = useNavigate();
  const [flightType, setFlightType] = useState('roundtrip');
  const [originAirport, setOriginAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [searchData, setSearchData] = useState({
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const popularDestinations = [
    { city: 'Medellín', code: 'MDE', image: 'https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt6e4661eb36e506d1/680e26ce77bfb6af094b59dc/iStock-1023022966-_Header_Mobile.jpg?fit=crop&disable=upscale&auto=webp&quality=60&crop=smart?w=400' },
    { city: 'Cartagena', code: 'CTG', image: 'https://media.staticontent.com/media/pictures/9495889e-54f9-40d2-939d-b04bf30b47c7?w=400' },
    { city: 'Santa Marta', code: 'SMR', image: 'https://hotelsantorini.com.co/wp-content/uploads/2025/01/23-ENE-PORTADA-915x515.jpg.webp?w=400' },
    { city: 'San Andrés', code: 'ADZ', image: 'https://media.staticontent.com/media/pictures/ecc404e8-9a99-46b0-a56a-ead992b5166e?w=400' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    // Validar que se hayan seleccionado origen y destino
    if (!originAirport || !destinationAirport) {
      alert('Por favor selecciona origen y destino');
      return;
    }

    // Usar los códigos de los aeropuertos seleccionados
    navigate(`/results?origin=${originAirport.code}&destination=${destinationAirport.code}&date=${searchData.departureDate}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200"
            alt="Avión"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Vuela por Colombia
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Descubre los mejores destinos con las mejores tarifas
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl">
            <div className="flex space-x-4 mb-6 border-b pb-4">
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition ${flightType === 'roundtrip'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setFlightType('roundtrip')}
              >
                <i className="fas fa-exchange-alt mr-2"></i>
                Ida y Vuelta
              </button>
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition ${flightType === 'oneway'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                onClick={() => setFlightType('oneway')}
              >
                <i className="fas fa-arrow-right mr-2"></i>
                Sólo Ida
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                  <AirportAutocomplete
                    value={originAirport}
                    onChange={setOriginAirport}
                    placeholder="Ciudad o aeropuerto"
                    icon="fas fa-plane-departure"
                    excludeCode={destinationAirport?.code}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                  <AirportAutocomplete
                    value={destinationAirport}
                    onChange={setDestinationAirport}
                    placeholder="Ciudad o aeropuerto"
                    icon="fas fa-plane-arrival"
                    excludeCode={originAirport?.code}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de ida</label>
                  <div className="relative">
                    <i className="fas fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      value={searchData.departureDate}
                      onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                {flightType === 'roundtrip' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de regreso</label>
                    <div className="relative">
                      <i className="fas fa-calendar-check absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                        value={searchData.returnDate}
                        onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pasajeros</label>
                  <div className="relative">
                    <i className="fas fa-users absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      value={searchData.passengers}
                      onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Pasajero' : 'Pasajeros'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clase</label>
                  <div className="relative">
                    <i className="fas fa-crown absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <select
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      value={searchData.class}
                      onChange={(e) => setSearchData({ ...searchData, class: e.target.value })}
                    >
                      <option value="economy">Económica</option>
                      <option value="premium">Económica Premium</option>
                      <option value="business">Ejecutiva</option>
                      <option value="first">Primera Clase</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                <i className="fas fa-search mr-2"></i>
                Buscar Vuelos
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Destinos Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-3">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{dest.city}</h3>
                  <p className="text-sm opacity-90">{dest.code}</p>
                </div>
              </div>
              <p className="text-blue-600 font-semibold">Desde $180,000 COP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">¿Por qué volar con nosotros?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Puntualidad</h3>
              <p className="text-gray-600">Más del 95% de nuestros vuelos salen a tiempo</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguridad</h3>
              <p className="text-gray-600">Certificados internacionales de seguridad</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-wifi text-4xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confort</h3>
              <p className="text-gray-600">Asientos ergonómicos y entretenimiento a bordo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;