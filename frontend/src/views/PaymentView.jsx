import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PaymentView = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos en segundos
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    installments: 1
  });

  // Temporizador de 15 minutos
  useEffect(() => {
    if (countdown <= 0) {
      toast.error('Tiempo de pago expirado');
      navigate('/my-reservations');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardData({ ...cardData, [name]: formatted });
    }
    // Formatear fecha de expiración
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\//g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').trim();
      setCardData({ ...cardData, [name]: formatted });
    }
    else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de pago con Wompi
    try {
      // Aquí iría la integración real con Wompi
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular pago exitoso
      toast.success('¡Pago procesado exitosamente!');

      // Simular envío de email de confirmación
      toast.success('Hemos enviado la confirmación a tu correo');

      navigate('/my-reservations');
    } catch (error) {
      toast.error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  // Tarjetas de prueba de Wompi
  const testCards = [
    { brand: 'Visa', number: '4242 4242 4242 4242' },
    { brand: 'Mastercard', number: '5555 5555 5555 4444' },
    { brand: 'American Express', number: '3782 822463 10005' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Temporizador */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-yellow-800 font-medium">Tiempo restante para completar el pago:</span>
        </div>
        <span className="text-2xl font-bold text-yellow-800">{formatTime(countdown)}</span>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pago seguro</h1>

        {/* Tarjetas de prueba */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">🔐 Modo prueba - Tarjetas de prueba:</p>
          <div className="space-y-1">
            {testCards.map((card, index) => (
              <p key={index} className="text-sm text-blue-600 font-mono">
                {card.brand}: {card.number}
              </p>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Número de tarjeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de tarjeta
            </label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>

          {/* Nombre del titular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del titular
            </label>
            <input
              type="text"
              name="cardHolder"
              value={cardData.cardHolder}
              onChange={handleInputChange}
              placeholder="JUAN PÉREZ"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Fecha de expiración y CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha expiración
              </label>
              <input
                type="text"
                name="expiryDate"
                value={cardData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/AA"
                maxLength="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Número de cuotas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de cuotas
            </label>
            <select
              name="installments"
              value={cardData.installments}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1">1 cuota (sin interés)</option>
              <option value="3">3 cuotas</option>
              <option value="6">6 cuotas</option>
              <option value="12">12 cuotas</option>
            </select>
          </div>

          {/* Botón de pago */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando pago...
              </div>
            ) : (
              'Pagar ahora'
            )}
          </button>
        </form>

        {/* Sellos de seguridad */}
        <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Pago seguro</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Datos encriptados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
