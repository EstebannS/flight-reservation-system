import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPasswordView = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('La contraseña debe tener al menos 6 caracteres');
    if (password !== confirm) return toast.error('Las contraseñas no coinciden');

    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Contraseña restablecida correctamente');
        navigate('/login');
      } else {
        toast.error(data.error || 'Error al restablecer contraseña');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Restablecer contraseña</h2>
        {!token ? (
          <p className="text-sm text-gray-600">Token inválido. Por favor usa el enlace enviado a tu email.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">Nueva contraseña</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm">Confirmar contraseña</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{submitting ? 'Restableciendo...' : 'Restablecer contraseña'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordView;
