import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileView = () => {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    birth_date: user?.birth_date ? user.birth_date.split('T')[0] : ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Perfil actualizado');
        // Reload to refresh context state
        window.location.reload();
      } else {
        toast.error(data.error || 'Error actualizando perfil');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileView;
