import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReservationView = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Reservar Vuelo #{flightId}
        </h1>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Detalles del Vuelo</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Aerolínea</p>
                <p className="font-semibold">Avianca</p>
              </div>
              <div>
                <p className="text-gray-600">Número de Vuelo</p>
                <p className="font-semibold">AV123</p>
              </div>
              <div>
                <p className="text-gray-600">Origen</p>
                <p className="font-semibold">Bogotá (BOG)</p>
              </div>
              <div>
                <p className="text-gray-600">Destino</p>
                <p className="font-semibold">Medellín (MDE)</p>
              </div>
              <div>
                <p className="text-gray-600">Fecha</p>
                <p className="font-semibold">20/03/2024</p>
              </div>
              <div>
                <p className="text-gray-600">Hora</p>
                <p className="font-semibold">08:00</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Pasajeros</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Documento"
                  className="border rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-4">Asientos</h2>
            <div className="grid grid-cols-6 gap-2">
              {['12A', '12B', '12C', '13A', '13B', '13C'].map(seat => (
                <button
                  key={seat}
                  className="border rounded-lg p-2 hover:bg-blue-50 hover:border-blue-500"
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total a pagar</p>
              <p className="text-3xl font-bold text-blue-600">,000</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => navigate(/payment/)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continuar al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationView;
