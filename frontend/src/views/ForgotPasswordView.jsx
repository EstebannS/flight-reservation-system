import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPasswordView = () => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Si el email existe, recibirás un enlace para restablecer la contraseña');
      } else {
        toast.error(data.error || 'Error al solicitar recuperación');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Correo electrónico</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex justify-between items-center">
            <Link to="/login" className="text-sm text-blue-600">Volver al login</Link>
            <button type="submit" disabled={sending} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{sending ? 'Enviando...' : 'Enviar enlace'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordView;
