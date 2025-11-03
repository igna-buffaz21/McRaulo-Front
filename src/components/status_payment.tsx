import { useSearchParams } from "react-router-dom"
import { useEffect } from "react";
import { paymentService } from "@/services/payment.servicio";
import type { ComprobarPagoResponse } from "@/interfaces/payment.interface";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { clearCheckout } from "@/services/checkout.servicio";
import { emptyCart } from "@/services/carrito.servicio";

export default function StatusPayment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const pedidoId = searchParams.get("external_reference")
    const paymentId = searchParams.get("payment_id")

    const [loading, setLoading] = useState(true);
    const [pedido, setPedido] = useState<ComprobarPagoResponse[]>([]);
    const [countdown, setCountdown] = useState(8);
    const [isCashPayment, setIsCashPayment] = useState(false); // 👈 Nuevo estado

    useEffect(() => {
        setLoading(true);

        console.log("PEDIDO ID: " + pedidoId)
        console.log("PAGO ID: " + paymentId)

        if (pedidoId && !paymentId) {
          setIsCashPayment(true);
          setLoading(false);
          return;
        }
    
        // 💳 Si hay ambos, es un pago online
        if (pedidoId && paymentId) {
          comprobarPago(Number(pedidoId), Number(paymentId));
        }

        clearCheckout();
        emptyCart();

    }, [pedidoId, paymentId]
)

    async function comprobarPago(idPedido: number, idPago: number) {
        try {
            const response = await paymentService.comprobarPago(idPedido, idPago);

                // Validamos la respuesta antes de continuar
            if (!response || response.length === 0) {
                console.warn("⚠️ No se encontró ningún pago para el pedido:", idPedido);
                setLoading(false);
                return;
            }

            if (response[0].estado_pago == 'approved') {
                response[0].estado_pago = 'Aprobado';
            }
            else if (response[0].estado_pago == 'pending') {
                response[0].estado_pago = 'Pendiente';
            }
            else if (response[0].estado_pago == 'rejected') {
                response[0].estado_pago = 'Rechazado';
            }

            if (response[0].tipo == 'takeaway') {
                response[0].tipo = 'Para Llevar';
            }
            else if (response[0].tipo == 'dine-in') {
                response[0].tipo = 'Comer en el Local';
            }

            setPedido(response);
            setLoading(false);

            console.log("Respuesta de comprobación de pago:", response);
        }
        catch (error) {
            setLoading(false);
            console.error("Error al comprobar el pago:", error);
        }
    }

    useEffect(() => {
        if (pedido[0] && pedido[0].estado_pago === 'Aprobado') {
        const timer = setInterval(() => {
            setCountdown((prev) => {
            if (prev <= 1) {
                clearInterval(timer);

                navigate('/');

                console.log('Redirigiendo al inicio...');
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        }
    }, [pedido]);

    const formatearFecha = (timestamp: number): string => {
      const fecha = new Date(timestamp * 1000);
      return fecha.toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-red-600 text-white p-6 shadow-lg flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-bold">Confirmación de Pedido</h1>
                </div>
              </div>
            </div>
    
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
                  <p className="text-gray-600 text-lg">Procesando tu pedido...</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

    if (!pedido) {
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-red-600 text-white p-6 shadow-lg flex-shrink-0">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-bold">Confirmación de Pedido</h1>
                </div>
              </div>
            </div>
    
            <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-yellow-100 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">No se encontró el pedido</h2>
                  <p className="text-gray-600 mb-6">No pudimos cargar la información de tu pedido</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200">
                    Volver al Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (isCashPayment && pedidoId) {
        return (
          <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-yellow-50 p-8 flex flex-col items-center">
                <div className="bg-yellow-500 rounded-full p-4 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pedido Registrado
                </h2>
                <p className="text-gray-600 text-center">
                  Tu pedido fue registrado correctamente.
                </p>
              </div>
    
              <div className="p-6 text-center space-y-4">
                <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                  <p className="text-3xl font-bold text-red-600">#{pedidoId}</p>
                </div>
    
                <p className="text-gray-700 text-lg">
                  Dirígete a la caja para realizar el pago en efectivo. Gracias por tu compra!
                </p>
    
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform"
                  onClick={() => navigate("/")}
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        );
      }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
      
        {/* Header rojo arriba */}
        <div className="bg-red-600 text-white p-6 shadow-lg flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold">Confirmación de Pedido</h1>
            </div>
          </div>
        </div>
  
        {/* Contenido central */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
          
          {/* Card de confirmación */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Si el pago fue rechazado, mostrar solo mensaje de error */}
            {pedido[0].estado_pago === 'Rechazado' ? (
              <>
                <div className="bg-red-50 p-8 flex flex-col items-center">
                  <div className="bg-red-500 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Rechazado</h2>
                  <p className="text-gray-600 text-center">El pago no pudo ser procesado</p>
                </div>
  
                <div className="p-8">
                  <p className="text-gray-600 text-center mb-6">
                    Hubo un error inesperado al procesar tu pago. Por favor, intenta realizar tu pedido nuevamente.
                  </p>
                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform"
                    onClick={() => navigate('/')}>
                    Empezar de Nuevo
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Ícono de éxito o pendiente */}
                {pedido[0].estado_pago === 'Pendiente' ? (
                  <div className="bg-yellow-50 p-8 flex flex-col items-center">
                    <div className="bg-yellow-500 rounded-full p-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Pendiente</h2>
                    <p className="text-gray-600 text-center">Tu pago está siendo procesado</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-8 flex flex-col items-center">
                    <div className="bg-green-500 rounded-full p-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
                    <p className="text-gray-600 text-center">Tu pedido ha sido confirmado</p>
                  </div>
                )}
  
                {/* Detalles del pedido */}
                <div className="p-6 space-y-4">
                  
                  {/* ID del Pedido - Destacado */}
                  <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                    <p className="text-3xl font-bold text-red-600">#{pedido[0].id_pedido}</p>
                  </div>
  
                  {/* Fecha y Hora */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Fecha y Hora</p>
                      <p className="font-bold text-gray-900">{formatearFecha(pedido[0].fecha_hora)}</p>
                    </div>
                  </div>
  
                  {/* Tipo de Pedido */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Tipo de Pedido</p>
                      <p className="font-bold text-gray-900">{pedido[0].tipo}</p>
                    </div>
                  </div>
  
                  {/* Estado de Pago */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`rounded-lg p-2 ${
                      pedido[0].estado_pago === 'Aprobado' ? 'bg-green-100' : 
                      pedido[0].estado_pago === 'Pendiente' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${
                        pedido[0].estado_pago === 'Aprobado' ? 'text-green-600' : 
                        pedido[0].estado_pago === 'Pendiente' ? 'text-yellow-600' : 'text-red-600'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Estado de Pago</p>
                      <p className={`font-bold ${
                        pedido[0].estado_pago === 'Aprobado' ? 'text-green-600' : 
                        pedido[0].estado_pago === 'Pendiente' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{pedido[0].estado_pago}</p>
                    </div>
                  </div>
  
                </div>
  
                <div className="p-6 bg-gray-50 border-t">
                {pedido[0].estado_pago === 'Aprobado' ? (
                    <Button 
                    disabled
                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-xl h-auto text-lg"
                    >
                    <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        ></circle>
                        <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Redirigiendo en {countdown} segundos...
                    </Button>
                ) : (
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform">
                    Volver al Inicio
                    </button>
                )}
                </div>
              </>
            )}
  
          </div>
  
          {/* Mensaje adicional solo si NO fue rechazado */}
          {pedido[0].estado_pago !== 'Rechazado' && (
            pedido[0].estado_pago === 'Pendiente' ? (
              <p className="text-gray-600 text-center mt-6 max-w-md">
                Tu pago está siendo verificado. Te notificaremos cuando se confirme.
              </p>
            ) : (
              <p className="text-gray-600 text-center mt-6 max-w-md">
                Guarda tu número de pedido. Pronto recibirás tu orden.
              </p>
            )
          )}
  
        </div>
      </div>
    )
}