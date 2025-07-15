import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Bus, Truck, ShipWheel, Compass } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getUserData } from '../../utils/userStorage';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with provided publishable key
const stripePromise = loadStripe('pk_test_51Rl8KYIijd8SxuvTR5m5qkFPN559A3goZbGE6nUo2v2vuND49wcyLOR0Gbb1qyJ2SaRVC0w44gjRbL2yJrbqHvWH00qGmjDd52');

// Payment Form Component
const PaymentForm = ({ totalAmount, onPaymentSuccess, onPaymentError, submitting, setSubmitting }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setPaymentError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setSubmitting(true);
    setPaymentError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on your backend
      const { data } = await axios.post('http://localhost:8095/api/v1/payments/create-payment-intent', {
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd'
      });

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // You can get this from user data
          },
        },
      });

      if (error) {
        setPaymentError(error.message);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-800 mb-2">Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      {paymentError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {paymentError}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={!stripe || submitting}
        className="w-full px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Processing Payment...' : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </div>
  );
};

const ProceedModal = ({ open, message, onConfirm, onCancel, needDriver, setNeedDriver, needGuide, setNeedGuide, numPassengers, setNumPassengers }) => {
  const { tripId } = useParams();
  const userData = getUserData();
  const userId = userData?.uid || null;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    // Prevent background scroll when modal is open
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  useEffect(() => {
    const fetchVehicles = async () => {
      console.log('Fetching vehicles...');
      try {
        const response = await axios.get('http://localhost:8091/api/v1/admin/vehicle-types');
        console.log('Fetched vehicles:', response.data);
        if (response.status === 200 && response.data && response.data.data) {
          setVehicles(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicles');
        }
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    if (needDriver && open) {
      fetchVehicles();
    }
  }, [needDriver, open]);

  const handleProceed = async () => {
    if (!paymentCompleted) {
      // Show payment form if payment hasn't been completed
      setShowPayment(true);
      return;
    }

    // If payment is completed, proceed with trip initiation
    setSubmitting(true);
    let preferredVehicleTypeId = null;
    if (needDriver && selectedVehicle) {
      const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
      preferredVehicleTypeId = vehicleObj ? vehicleObj.id : null;
    }
    const payload = {
      userId,
      tripId,
      preferredVehicleTypeId,
      setGuide: needGuide ? 1 : 0,
      setDriver: needDriver ? 1 : 0,
      paymentIntentId // Include payment intent ID
    };
    try {
      console.log('Making API call to initiate trip...');
      const response = await axios.post('http://localhost:8095/api/v1/trips/initiate', payload);
      console.log('API response:', response);
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentId) => {
    setPaymentIntentId(paymentId);
    setPaymentCompleted(true);
    setShowPayment(false);
    console.log('Payment successful:', paymentId);
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  const calculateTotal = () => {
    return (needDriver ? 200 : 0) + (needGuide ? 150 : 0);
  };

  const calculateAdvancePayment = () => {
    return calculateTotal() * 0.5;
  };

  if (!open) return null;
  const lines = message.split('\n');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full border border-gray-200" style={{ width: '900px' }}>
        <h4 className="text-lg font-bold mb-4 text-gray-900">Confirm Proceed</h4>
        <div className="flex flex-row">
          {/* Left: Modal Content */}
          <div className="w-[680px] pr-12">
            <div className="mb-6 text-gray-700">
              {lines.map((line, idx) => (
                <p key={idx} className={idx === 0 ? '' : 'mt-2'}>{line}</p>
              ))}
              {/* Driver/Guide Selection */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-4 w-full">
                <button
                  type="button"
                  className={`w-[240px] min-w-[240px] px-5 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                    ${needDriver ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                  onClick={() => setNeedDriver(!needDriver)}
                  aria-pressed={needDriver}
                >
                  <ShipWheel className="mr-3" size={28} strokeWidth={2.2} />
                  <div className="flex flex-col items-start w-full">
                    <span className="font-bold mb-1 text-base">Driver</span>
                    <span className={`text-xs ${needDriver ? 'text-blue-800' : 'text-gray-500'}`}>{needDriver ? 'Driver Needed' : 'No Driver'}</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`w-[240px] min-w-[240px] px-5 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                    ${needGuide ? 'bg-blue-100 text-blue-900 border-blue-600' : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                  onClick={() => setNeedGuide(!needGuide)}
                  aria-pressed={needGuide}
                >
                  <Compass className="mr-3" size={28} strokeWidth={2.2} />
                  <div className="flex flex-col items-start w-full">
                    <span className="font-bold mb-1 text-base">Guide</span>
                    <span className={`text-xs ${needGuide ? 'text-blue-800' : 'text-gray-500'}`}>{needGuide ? 'Guide Needed' : 'No Guide'}</span>
                  </div>
                </button>
              </div>
              {/* Passenger and vehicle selection only if driver is needed */}
              {needDriver && (
                <>
                  <div className="mt-4 relative w-full max-w-xs flex items-center">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Number of Passengers</label>
                    <div className="relative w-full">
                      <select
                        value={numPassengers}
                        onChange={e => {
                          setNumPassengers(Number(e.target.value));
                          setSelectedVehicle(''); // Reset vehicle selection when passenger count changes
                        }}
                        className="px-5 py-2 rounded-full border-2 border-gray-300 bg-white text-gray-800 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-150 appearance-none w-full pr-10"
                        style={{ minWidth: '140px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)', WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                      >
                        {[...Array(15)].map((_, i) => (
                          <option key={i + 1} value={i + 1} className="bg-white text-gray-800 font-medium">
                            {i + 1} Passenger{i === 0 ? '' : 's'}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 inset-y-0 flex items-center text-gray-400">
                        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 w-full max-w-xl">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Vehicle Type</label>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-3 w-full">
                      {vehicles.map(vehicle => {
                        const isSelected = selectedVehicle === vehicle.typeName;
                        const isInvalid = isSelected && vehicle.capacity < numPassengers;
                        let icon = null;
                        if (/car/i.test(vehicle.typeName)) {
                          icon = <Car className="mr-3" size={28} strokeWidth={2.2} />;
                        } else if (/van/i.test(vehicle.typeName)) {
                          icon = <Truck className="mr-3" size={28} strokeWidth={2.2} />;
                        } else if (/bus/i.test(vehicle.typeName)) {
                          icon = <Bus className="mr-3" size={28} strokeWidth={2.2} />;
                        } else {
                          icon = <Car className="mr-3" size={28} strokeWidth={2.2} />;
                        }
                        return (
                          <button
                            key={vehicle.id}
                            type="button"
                            className={`w-full min-w-[240px] px-5 py-4 rounded-lg border-2 font-semibold transition-colors duration-150 focus:outline-none text-left flex items-center
                              ${isSelected ? (isInvalid ? 'border-red-600 bg-white text-red-600' : 'bg-blue-100 text-blue-900 border-blue-600') : 'bg-white text-gray-800 border-gray-300 hover:bg-primary-50'}`}
                            onClick={() => setSelectedVehicle(vehicle.typeName)}
                            disabled={submitting}
                          >
                            {icon}
                            <div className="flex flex-col items-start w-full">
                              <span className="font-bold mb-1">{vehicle.typeName}</span>
                              <span className={`text-xs ${isSelected ? (isInvalid ? 'text-red-600' : 'text-blue-800') : 'text-gray-500'}`}>Capacity: {vehicle.capacity} passengers</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {vehicles.filter(vehicle => vehicle.capacity >= numPassengers).length === 0 && (
                      <span className="block mt-2 text-sm text-red-500">No vehicles available for {numPassengers} passengers.</span>
                    )}
                    {selectedVehicle && (() => {
                      const vehicleObj = vehicles.find(v => v.typeName === selectedVehicle);
                      if (vehicleObj && vehicleObj.capacity < numPassengers) {
                        return <div className="mt-2 text-sm text-red-600 font-semibold">Selected vehicle cannot accommodate {numPassengers} passengers. Please choose another.</div>;
                      }
                      return null;
                    })()}
                  </div>
                </>
              )}
              {!needDriver && (
                <div className="mt-4 text-sm text-blue-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg p-3">
                  To choose a vehicle type, please select <span className="font-bold">Driver</span> above.
                </div>
              )}
            </div>
          </div>
          {/* Vertical Divider */}
          <div className="w-px bg-gray-300 mx-6" style={{ minHeight: '420px' }}></div>
          {/* Right: Cost Breakdown */}
          <div className="w-[340px] flex flex-col h-full">
            <h4 className="text-lg font-bold mb-4 text-gray-900">Cost Breakdown</h4>
            <div className="space-y-3 flex-1">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Driver</span>
                <span className="font-medium">${needDriver ? '200.00' : '0.00'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-600">Guide</span>
                <span className="font-medium">${needGuide ? '150.00' : '0.00'}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="font-bold text-primary-700 text-lg">${calculateTotal()}.00</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-900 font-bold">Advance Payment (50%)</span>
                <span className="font-bold text-primary-600 text-lg">${calculateAdvancePayment()}.00</span>
              </div>
              {paymentCompleted && (
                <div className="flex justify-between mt-2 text-green-600">
                  <span className="font-bold">Payment Status</span>
                  <span className="font-bold">✓ Paid</span>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2">You must pay 50% of the total cost before the start of your trip.</div>
              
              {/* Payment Form */}
              {showPayment && calculateAdvancePayment() > 0 && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    totalAmount={calculateAdvancePayment()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                  />
                </Elements>
              )}
            </div>
            {/* Button group */}
            <div className="flex gap-4 justify-end mt-auto pt-8">
              <button
                onClick={() => {
                  setShowPayment(false);
                  setPaymentCompleted(false);
                  setPaymentIntentId(null);
                  onCancel();
                }}
                className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold border border-gray-400 transition-colors whitespace-nowrap"
                disabled={submitting}
              >
                Cancel
              </button>
              {!showPayment && (
                <button
                  onClick={() => {
                    console.log('🔍 Button click attempted!');
                    console.log('Button disabled status:', submitting || (needDriver && !selectedVehicle));
                    console.log('submitting:', submitting);
                    console.log('needDriver:', needDriver);
                    console.log('selectedVehicle:', selectedVehicle);
                    console.log('paymentCompleted:', paymentCompleted);
                    console.log('Condition breakdown:', {
                      submitting,
                      needDriver,
                      selectedVehicle,
                      paymentCompleted,
                      isDisabled: submitting || (needDriver && !selectedVehicle)
                    });
                    handleProceed();
                  }}
                  className={`px-6 py-2 rounded-full font-semibold border transition-colors whitespace-nowrap ${
                    paymentCompleted 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-200'
                      : 'bg-primary-600 hover:bg-primary-700 text-white border-blue-200'
                  }`}
                  disabled={submitting || (needDriver && !selectedVehicle)}
                >
                  {submitting 
                    ? 'Processing...' 
                    : paymentCompleted 
                      ? 'Complete Booking' 
                      : calculateAdvancePayment() > 0 
                        ? `Pay $${calculateAdvancePayment()}.00 & Proceed`
                        : 'Yes, Proceed'
                  }
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedModal;
