import { useState, useEffect } from "react";
import {
  loadCheckout,
  updateOrderType,
  updatePaymentMethod,
  goBackStep,
  saveCheckout
} from "@/services/checkout.servicio";
import { loadCart } from "@/services/carrito.servicio";
import { useNavigate } from "react-router-dom";
import { paymentService } from "@/services/payment.servicio";
import type { CrearOrden } from "@/interfaces/payment.interface";
import { METODO_PAGO } from "@/config/const";
import { Loader2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: any
}

interface OrderType {
  id: string;
  name: string;
  description: string;
  icon: any
  time: string;
}

export default function PaymentMethods() {
  const cart = loadCart();
  const [checkout, setCheckout] = useState(() => loadCheckout(cart.id_cart));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState<number>(checkout.currentStep);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    checkout.paymentMethod?.toString() || ""
  );
  const [orderType, setOrderType] = useState<string>(
    checkout.orderType?.toString() || ""
  );

  useEffect(() => {
    saveCheckout({
      id_cart: cart.id_cart,
      currentStep,
      orderType: orderType || null,
      paymentMethod: selectedPaymentMethod || null,
    });
  }, [currentStep, orderType, selectedPaymentMethod]);
  

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mercado-pago',
      name: 'Mercado Pago',
      description: 'Debito, Credito o QR',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'cash',
      name: 'Efectivo',
      description: 'Pagar en efectivo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const orderTypes: OrderType[] = [
    {
      id: 'takeaway',
      name: 'Para Llevar',
      description: 'Retira tu pedido en el local',
      icon: "bolso.png",
      time: 'Listo en 15-20 min'
    },
    {
      id: 'dine-in',
      name: 'Comer Aquí',
      description: 'Disfruta en nuestro restaurante',
      icon: "plato.png",
      time: 'Servido en mesa'
    }
  ];

  const getStepTitle = (): string => {
    switch(currentStep) {
      case 1: return 'Tipo de Pedido';
      case 2: return 'Método de Pago';
      case 3: return 'Confirmar Pedido';
      default: return 'Finalizar Pedido';
    }
  };

  const goBack = (): void => {
    const updated = goBackStep(cart.id_cart);
    setCurrentStep(updated.currentStep);
    setCheckout(updated);
  };
  
  async function crearOrden() {
    try {
      if (cart == null) {
        return;
      }

      setLoading(true); // 🔹 activa el modo "procesando"

      const crearOrden : CrearOrden = {
        cart_products: cart.items,
        checkout_steps: checkout 
      }

      const response = await paymentService.crearOrden(crearOrden)

      console.log(response);

      if (response.type == METODO_PAGO.MERCADO_PAGO && response.init_point) {
        window.location.href = response.init_point;
      }
      else if (response.type == METODO_PAGO.EFECTIVO) {
        navigate('/estado-pago?external_reference=' + response.idPedido)
      }      
    }
    catch (error) {
      console.log(error);
      setLoading(false); // 🔹 activa el modo "procesando"
    }
  }

  const canProceed: any = currentStep === 3 && selectedPaymentMethod && orderType;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      
      <div className="bg-red-600 text-white p-6 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 1 && (
                <button 
                  onClick={goBack}
                  className="p-2 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Indicador de pasos */}
              <div className="hidden sm:flex items-center gap-2">
                {[1, 2, 3].map((step: number) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step <= currentStep ? 'bg-white text-red-600' : 'bg-red-700 text-red-300'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 mx-1 ${
                        step < currentStep ? 'bg-white' : 'bg-red-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-red-700 px-4 py-2 rounded-full">
                <span className="text-lg font-medium">Total: ${(cart.totales.subtotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        
        {/* PASO 1: Tipo de pedido */}
        {currentStep === 1 && (
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 animate-in fade-in duration-300">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Cómo quieres tu pedido?
              </h2>
              <p className="text-lg text-gray-600">
                Selecciona si vas a llevarlo o comer en el local
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {orderTypes.map((type: OrderType) => (
                <div
                  key={type.id}
                  onClick={() => setOrderType(type.id)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:scale-105 ${
                    orderType === type.id
                      ? "border-red-500 bg-red-50 ring-2 ring-red-200 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 p-3 rounded-xl flex items-center justify-center overflow-hidden ${
                        orderType === type.id
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {typeof type.icon === "string" ? (
                        <img
                          src={type.icon}
                          alt={type.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        type.icon
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 text-xl mb-2">
                      {type.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{type.description}</p>
                    <span className="text-red-600 font-bold">{type.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón para confirmar selección */}
            {orderType && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const updated = updateOrderType(cart.id_cart, orderType);
                    setCheckout(updated);
                    setCurrentStep(2);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform flex items-center justify-center gap-2 mx-auto"
                >
                  Confirmar elección
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}


        {/* PASO 2: Métodos de pago */}
        {currentStep === 2 && (
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 animate-in fade-in duration-300">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Método de pago</h2>
              <p className="text-lg text-gray-600">Selecciona cómo quieres pagar tu pedido</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {paymentMethods.map((method: PaymentMethod) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:scale-105 ${
                    selectedPaymentMethod === method.id
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-200 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 p-2 rounded-xl ${
                      selectedPaymentMethod === method.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {method.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{method.name}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini resumen del tipo de pedido seleccionado */}
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 text-sm">Tipo de pedido seleccionado:</p>
              <p className="font-bold text-gray-900">
                {orderTypes.find(t => t.id === orderType)?.name} - {orderTypes.find(t => t.id === orderType)?.time}
              </p>
            </div>

            {/* Botón para confirmar selección */}
            {selectedPaymentMethod && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => {
                    const updated = updatePaymentMethod(cart.id_cart, selectedPaymentMethod);
                    setCheckout(updated);
                    setCurrentStep(3);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform flex items-center justify-center gap-2 mx-auto"
                >
                  Continuar
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}


        {/* PASO 3: Resumen final */}
        {currentStep === 3 && (
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 animate-in fade-in duration-300">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Resumen del pedido</h2>
              <p className="text-xl text-gray-600">Revisa los detalles antes de confirmar</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Selecciones realizadas */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">Detalles del pedido</h3>
                  <div className="space-y-4">
                    {/* Tipo de pedido */}
                    <div>
                      <span className="text-gray-600 font-medium">Tipo de pedido:</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-8 h-8 p-1 bg-red-100 text-red-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {(() => {
                            const type = orderTypes.find(t => t.id === orderType);
                            if (!type) return null;
                            return typeof type.icon === "string" ? (
                              <img
                                src={type.icon}
                                alt={type.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              type.icon
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {orderTypes.find(t => t.id === orderType)?.name}
                          </p>
                          <p className="text-red-600 font-medium text-sm">
                            {orderTypes.find(t => t.id === orderType)?.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Método de pago */}
                    <div>
                      <span className="text-gray-600 font-medium">Método de pago:</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-8 h-8 p-1 bg-red-100 text-red-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {(() => {
                            const method = paymentMethods.find(m => m.id === selectedPaymentMethod);
                            if (!method) return null;
                            return typeof method.icon === "string" ? (
                              <img
                                src={method.icon}
                                alt={method.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              method.icon
                            );
                          })()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose de precios */}
              <div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => navigate('/carrito')}
                        className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Carrito
                      </button>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-red-600">${(cart.totales.subtotal).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={crearOrden}
                  disabled={!canProceed || loading}
                  className={`w-full mt-6 font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-xl ${
                    canProceed && !loading
                      ? "bg-red-600 hover:bg-red-700 text-white hover:scale-105 transform"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                      Procesando pedido...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmar Pedido
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}