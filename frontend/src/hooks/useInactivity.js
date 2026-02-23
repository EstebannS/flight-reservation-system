import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useInactivity = (timeout = 15 * 60 * 1000) => { // 15 minutos en milisegundos
  const { logout } = useAuth();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      toast.error('Sesión expirada por inactividad');
      logout();
    }, timeout);
  };

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click'
    ];

    // Iniciar timer
    resetTimer();

    // Agregar event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return resetTimer;
};

export default useInactivity;
