import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        console.log('Sesión verificada:', data.data.user);
      } else {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setToken(data.data.token);
        setUser(data.data.user);
        toast.success('¡Bienvenido ' + data.data.user.full_name + '!');
        navigate('/');
        return { success: true };
      } else {
        toast.error(data.error || 'Error al iniciar sesión');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        // If backend returned a token, log the user in. Otherwise require email verification.
        if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
          setToken(data.data.token);
          setUser(data.data.user);
          toast.success('¡Registro exitoso! Bienvenido ' + data.data.user.full_name);
          navigate('/');
          return { success: true };
        }

        toast.success('Registro recibido. Revisa tu correo para verificar la cuenta.');
        navigate('/login');
        return { success: true };
      } else {
        toast.error(data.error || 'Error al registrarse');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('Error de conexión');
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
    toast.success('Sesión cerrada');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};