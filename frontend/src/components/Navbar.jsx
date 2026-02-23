import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg transform group-hover:rotate-12 transition duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="font-bold text-2xl text-gray-800">SkyReserve</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Vuelos
                </Link>
                <Link to="/my-reservations" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Mis Reservas
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {user?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">{user?.full_name?.split(' ')[0]}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mi Perfil
                      </Link>
                      <Link
                        to="/my-reservations"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mis Reservas
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Registrarse
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vuelos
                </Link>
                <Link
                  to="/my-reservations"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mis Reservas
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-blue-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;