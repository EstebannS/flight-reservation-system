import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { classOptions, baggageOptions, mealOptions, insuranceOptions } from '../data/airports';

const FlightReservationFlow = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // Estados del flujo
  const [currentStep, setCurrentStep] = useState(1);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos de la reserva
  const [reservationData, setReservationData] = useState({
    passengers: [{
      id: 1,
      type: 'ADULT',
      firstName: '',
      lastName: '',
      documentType: 'CC',
      documentNumber: '',
      birthDate: '',
      email: user?.email || '',
      phone: '',
      baggage: 'none',
      meal: 'standard',
      seat: null
    }],
    selectedClass: 'economy',
    selectedBaggage: 'none',
    selectedInsurance: 'none',
    totalAmount: 0,
    flightId: flightId
  });

  // Precios base (simulados)
  const basePrice = 250000;

  useEffect(() => {
    // Cargar datos del vuelo
    setTimeout(() => {
      const mockFlight = {
        id: flightId,
        airline: 'Avianca',
        flightNumber: 'AV123',
        origin: 'BOG',
        destination: 'MDE',
        departureTime: '08:00',
        arrivalTime: '09:00',
        date: '2024-03-20',
        duration: 60,
        aircraft: 'Airbus A320',
        seats: {
          economy: 120,
          premium: 30,
          business: 20,
          first: 10
        }
      };
      setFlight(mockFlight);
      setLoading(false);
    }, 1000);
  }, [flightId]);

  // CORREGIDO: useEffect con las dependencias correctas para calcular el total
  useEffect(() => {
    calculateTotal();
  }, [reservationData.selectedClass, reservationData.selectedBaggage, reservationData.selectedInsurance, reservationData.passengers.length]);

  const calculateTotal = () => {
    const classMultiplier = classOptions.find(c => c.id === reservationData.selectedClass)?.multiplier || 1;
    const baggagePrice = baggageOptions.find(b => b.id === reservationData.selectedBaggage)?.price || 0;
    const insurancePrice = insuranceOptions.find(i => i.id === reservationData.selectedInsurance)?.price || 0;

    const subtotal = basePrice * classMultiplier;
    const total = (subtotal + baggagePrice + insurancePrice) * reservationData.passengers.length;

    // Solo actualizar si el total realmente cambió para evitar bucles
    if (total !== reservationData.totalAmount) {
      setReservationData(prev => ({ ...prev, totalAmount: total }));
    }
  };

  const addPassenger = () => {
    if (reservationData.passengers.length >= 6) {
      toast.error('Máximo 6 pasajeros por reserva');
      return;
    }

    const newId = reservationData.passengers.length + 1;
    setReservationData(prev => ({
      ...prev,
      passengers: [
        ...prev.passengers,
        {
          id: newId,
          type: 'ADULT',
          firstName: '',
          lastName: '',
          documentType: 'CC',
          documentNumber: '',
          birthDate: '',
          email: '',
          phone: '',
          baggage: prev.selectedBaggage,
          meal: 'standard',
          seat: null
        }
      ]
    }));
  };

  const removePassenger = (id) => {
    if (reservationData.passengers.length === 1) {
      toast.error('Debe haber al menos un pasajero');
      return;
    }
    setReservationData(prev => ({
      ...prev,
      passengers: prev.passengers.filter(p => p.id !== id)
    }));
  };

  const updatePassenger = (id, field, value) => {
    setReservationData(prev => ({
      ...prev,
      passengers: prev.passengers.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleClassChange = (classId) => {
    setReservationData(prev => ({ ...prev, selectedClass: classId }));
  };

  const handleBaggageChange = (baggageId) => {
    setReservationData(prev => ({ ...prev, selectedBaggage: baggageId }));
    // Actualizar equipaje para todos los pasajeros
    setReservationData(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => ({ ...p, baggage: baggageId }))
    }));
  };

  const handleInsuranceChange = (insuranceId) => {
    setReservationData(prev => ({ ...prev, selectedInsurance: insuranceId }));
  };

  const handleContinue = async () => {
    // Validar datos de pasajeros según el paso
    if (currentStep === 1) {
      // Validar clase y equipaje (ya están seleccionados)
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validar datos de pasajeros
      let isValid = true;
      reservationData.passengers.forEach(p => {
        if (!p.firstName || !p.lastName || !p.documentNumber) {
          isValid = false;
        }
      });

      if (isValid) {
        setCurrentStep(3);
      } else {
        toast.error('Completa todos los datos de los pasajeros');
      }
    } else if (currentStep === 3) {
      // Crear reserva y continuar al pago
      await createReservation();
    }
  };

  const createReservation = async () => {
    try {
      console.log('Creando reserva con token:', token);

      const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          flightId: parseInt(flightId),
          passengers: reservationData.passengers.map(p => ({
            name: `${p.firstName} ${p.lastName}`,
            document: p.documentNumber,
            type: p.type,
            price: basePrice * (classOptions.find(c => c.id === reservationData.selectedClass)?.multiplier || 1)
          })),
          totalAmount: reservationData.totalAmount,
          class: reservationData.selectedClass,
          baggage: reservationData.selectedBaggage,
          insurance: reservationData.selectedInsurance
        })
      });

      console.log('Respuesta status:', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Reserva creada:', data);

      if (data.success) {
        toast.success('Reserva creada exitosamente');
        navigate(`/payment/${data.data.id}`);
      } else {
        toast.error(data.error || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error en createReservation:', error);
      toast.error('Error al procesar la reserva: ' + error.message);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 
                ${currentStep >= step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-center w-1/3">Clase y Equipaje</span>
          <span className="text-center w-1/3">Datos de Pasajeros</span>
          <span className="text-center w-1/3">Resumen y Pago</span>
        </div>
      </div>

      {/* Flight Summary Card */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-semibold">{flight.airline} - {flight.flightNumber}</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {flight.origin} → {flight.destination}
            </h2>
            <p className="text-gray-600">
              {new Date(flight.date).toLocaleDateString('es-ES')} • {flight.departureTime} - {flight.arrivalTime}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Duración</p>
            <p className="font-semibold">{flight.duration} minutos</p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Step 1: Clase y Equipaje */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Selecciona la clase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classOptions.map((classOption) => (
                  <div
                    key={classOption.id}
                    onClick={() => handleClassChange(classOption.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${reservationData.selectedClass === classOption.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{classOption.name}</h4>
                        <p className="text-sm text-gray-600">{classOption.description}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        ${(basePrice * classOption.multiplier).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Equipaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {baggageOptions.map((baggage) => (
                  <div
                    key={baggage.id}
                    onClick={() => handleBaggageChange(baggage.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${reservationData.selectedBaggage === baggage.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{baggage.name}</h4>
                        <p className="text-sm text-gray-600">{baggage.description}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {baggage.price > 0 ? `$${baggage.price.toLocaleString()}` : 'Incluido'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Seguro de viaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insuranceOptions.map((insurance) => (
                  <div
                    key={insurance.id}
                    onClick={() => handleInsuranceChange(insurance.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${reservationData.selectedInsurance === insurance.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{insurance.name}</h4>
                        <p className="text-sm text-gray-600">{insurance.description}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">
                        {insurance.price > 0 ? `$${insurance.price.toLocaleString()}` : 'Sin seguro'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Datos de Pasajeros */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Datos de los pasajeros</h3>
              <button
                onClick={addPassenger}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Agregar pasajero
              </button>
            </div>

            {reservationData.passengers.map((passenger, index) => (
              <div key={passenger.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-lg">Pasajero {index + 1}</h4>
                  {reservationData.passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(passenger.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de pasajero
                    </label>
                    <select
                      value={passenger.type}
                      onChange={(e) => updatePassenger(passenger.id, 'type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="ADULT">Adulto</option>
                      <option value="CHILD">Niño (2-11 años)</option>
                      <option value="INFANT">Infante (0-2 años)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de documento
                    </label>
                    <select
                      value={passenger.documentType}
                      onChange={(e) => updatePassenger(passenger.id, 'documentType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PASSPORT">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombres
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="Juan"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="Pérez"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      value={passenger.documentNumber}
                      onChange={(e) => updatePassenger(passenger.id, 'documentNumber', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={passenger.birthDate}
                      onChange={(e) => updatePassenger(passenger.id, 'birthDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferencia de comida
                  </label>
                  <select
                    value={passenger.meal}
                    onChange={(e) => updatePassenger(passenger.id, 'meal', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    {mealOptions.map(meal => (
                      <option key={meal.id} value={meal.id}>{meal.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Resumen y Pago */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Resumen de tu reserva</h3>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="font-semibold">Vuelo {flight.flightNumber}</p>
                  <p className="text-sm text-gray-600">{flight.airline}</p>
                </div>
                <p className="font-bold text-blue-600">
                  ${basePrice.toLocaleString()} x persona
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span>Clase {classOptions.find(c => c.id === reservationData.selectedClass)?.name}</span>
                <span>${(basePrice * (classOptions.find(c => c.id === reservationData.selectedClass)?.multiplier || 1)).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Equipaje: {baggageOptions.find(b => b.id === reservationData.selectedBaggage)?.name}</span>
                <span>${baggageOptions.find(b => b.id === reservationData.selectedBaggage)?.price.toLocaleString() || 0}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Seguro: {insuranceOptions.find(i => i.id === reservationData.selectedInsurance)?.name}</span>
                <span>${insuranceOptions.find(i => i.id === reservationData.selectedInsurance)?.price.toLocaleString() || 0}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total ({reservationData.passengers.length} {reservationData.passengers.length === 1 ? 'pasajero' : 'pasajeros'})</span>
                  <span className="text-2xl text-blue-600">
                    ${reservationData.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Al continuar, serás redirigido a la pasarela de pago segura de Wompi.
                Una vez confirmado el pago, recibirás un email con los detalles de tu reserva.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Atrás
          </button>

          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            {currentStep === 3 ? 'Ir a pagar' : 'Continuar'}
          </button>
        </div>
      </div>

      {/* Price Summary Sidebar (fixed) */}
      <div className="mt-6 bg-blue-600 text-white rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Total estimado</p>
            <p className="text-3xl font-bold">${reservationData.totalAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">COP</p>
            <p className="text-sm">Incluye impuestos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightReservationFlow;