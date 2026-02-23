import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyReservationsView = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reservations/my-reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setReservations(data.data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Reserva cancelada exitosamente');
        fetchReservations();
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No tienes reservas activas</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Buscar Vuelos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(res => (
            <div key={res.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-2xl">✈️</span>
                    <div>
                      <p className="text-sm text-gray-500">Código de reserva</p>
                      <p className="font-mono font-bold text-lg">{res.reservation_code}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(res.status)}`}>
                      {res.status === 'PENDING' ? 'Pendiente' :
                        res.status === 'CONFIRMED' ? 'Confirmada' :
                          res.status === 'CANCELLED' ? 'Cancelada' : 'Completada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Origen - Destino</p>
                      <p className="font-semibold">{res.origin || 'BOG'} → {res.destination || 'MDE'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pasajeros</p>
                      <p className="font-semibold">{res.passenger_count || 1}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold text-blue-600">${res.total_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-semibold">{new Date(res.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {res.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsView;