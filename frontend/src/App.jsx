import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contextos
import { AuthProvider } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import InactivityWrapper from './components/InactivityWrapper';

// Vistas
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import SearchView from './views/SearchView';
import ResultsView from './views/ResultsView';
import FlightReservationFlow from './views/FlightReservationFlow';
import MyReservationsView from './views/MyReservationsView';
import PaymentView from './views/PaymentView';
import ProfileView from './views/ProfileView';
import ForgotPasswordView from './views/ForgotPasswordView';
import ResetPasswordView from './views/ResetPasswordView';
import VerifyEmailView from './views/VerifyEmailView';

// Estilos
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InactivityWrapper>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Toaster position="top-right" toastOptions={{
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
              duration: 4000,
            }} />
            
            <Routes>
              {/* Ruta pública principal */}
              <Route path="/" element={<HomeView />} />
              
              {/* Rutas de autenticación */}
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              
              {/* Rutas protegidas */}
              <Route path="/search" element={
                <PrivateRoute>
                  <SearchView />
                </PrivateRoute>
              } />
              
              <Route path="/results" element={
                <PrivateRoute>
                  <ResultsView />
                </PrivateRoute>
              } />
              
              <Route path="/reservation/:flightId" element={
                <PrivateRoute>
                  <FlightReservationFlow />
                </PrivateRoute>
              } />
              
              <Route path="/payment/:reservationId" element={
                <PrivateRoute>
                  <PaymentView />
                </PrivateRoute>
              } />
              
              <Route path="/my-reservations" element={
                <PrivateRoute>
                  <MyReservationsView />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfileView />
                </PrivateRoute>
              } />

              <Route path="/forgot-password" element={<ForgotPasswordView />} />
              <Route path="/reset-password" element={<ResetPasswordView />} />
              <Route path="/verify-email" element={<VerifyEmailView />} />
              
              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </InactivityWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;
