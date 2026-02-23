import React, { useState, useEffect, useRef } from 'react';

const AirportAutocomplete = ({ value, onChange, placeholder, icon, excludeCode = null }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const wrapperRef = useRef(null);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    // Cargar datos de aeropuertos
    import('../data/airports').then(module => {
      setAirports(module.colombianAirports);
    });
  }, []);

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Filtrar sugerencias basado en query
    if (query.length > 0) {
      const filtered = airports.filter(airport => {
        if (excludeCode && airport.code === excludeCode) return false;
        return (
          airport.city.toLowerCase().includes(query.toLowerCase()) ||
          airport.code.toLowerCase().includes(query.toLowerCase()) ||
          airport.name.toLowerCase().includes(query.toLowerCase())
        );
      });
      setSuggestions(filtered.slice(0, 8)); // Máximo 8 sugerencias
    } else {
      setSuggestions([]);
    }
  }, [query, excludeCode, airports]);

  const handleSelect = (airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.code})`);
    onChange(airport);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value) {
      onChange(null);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <i className={`${icon} absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`}></i>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          autoComplete="off"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((airport, index) => (
            <div
              key={index}
              onClick={() => handleSelect(airport)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900">{airport.city}</span>
                  <span className="text-sm text-gray-500 ml-2">({airport.code})</span>
                </div>
                <span className="text-xs text-gray-400">{airport.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;