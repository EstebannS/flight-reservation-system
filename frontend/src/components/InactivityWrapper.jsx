import React from 'react';
import useInactivity from '../hooks/useInactivity';
import { useAuth } from '../context/AuthContext';

const InactivityWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Solo activar el timer si el usuario está autenticado
  if (isAuthenticated) {
    useInactivity();
  }

  return <>{children}</>;
};

export default InactivityWrapper;
