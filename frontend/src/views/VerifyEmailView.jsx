import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmailView = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message || 'Correo verificado');
          navigate('/login');
        } else {
          toast.error(data.error || 'Error verificando correo');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white p-6 rounded shadow text-center">
        {loading ? (
          <p>Verificando correo...</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Verificar correo</h2>
            <p className="text-sm text-gray-600">Si el token es válido, serás redirigido al login.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailView;
