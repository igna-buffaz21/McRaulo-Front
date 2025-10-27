import { useSearchParams } from "react-router-dom"
import { useEffect } from "react";
import { paymentService } from "@/services/payment.servicio";
import type { ComprobarPagoResponse } from "@/interfaces/payment.interface";
import { useState } from "react";

export default function StatusPayment() {
    const [searchParams] = useSearchParams();

    const pedidoId = searchParams.get("external_reference")
    const paymentId = searchParams.get("payment_id")

    const [pedido, setPedido] = useState<ComprobarPagoResponse>();

    useEffect(() => {

        console.log("PEDIDO ID: " + pedidoId)
        console.log("PAGO ID: " + paymentId)

        comprobarPago(Number(pedidoId), Number(paymentId))

    }, [pedidoId, paymentId]
)

    async function comprobarPago(idPedido: number, idPago: number) {
        try {
            const response = await paymentService.comprobarPago(idPedido, idPago);

            setPedido(response);

            console.log("Respuesta de comprobación de pago:", response);
        }
        catch (error) {
            console.error("Error al comprobar el pago:", error);
        }
    }

    function formatearFecha(fechaHora: number): string {
        const fecha = new Date(fechaHora);
        return fecha.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
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
            
            {/* Ícono de éxito */}
            <div className="bg-green-50 p-8 flex flex-col items-center">
              <div className="bg-green-500 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h2>
              <p className="text-gray-600 text-center">Tu pedido ha sido confirmado</p>
            </div>
  
            {/* Detalles del pedido */}
            <div className="p-6 space-y-4">
              
              {/* ID del Pedido - Destacado */}
              <div className="bg-red-50 rounded-xl p-4 text-center border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
                <p className="text-3xl font-bold text-red-600">#{pedido!!.id_pedido}</p>
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
                  <p className="font-bold text-gray-900">{formatearFecha(pedido!!.fecha_hora)}</p>
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
                  <p className="font-bold text-gray-900">{pedido!!.tipo}</p>
                </div>
              </div>
  
              {/* Estado de Pago */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Estado de Pago</p>
                  <p className="font-bold text-green-600">{pedido!!.estado_pago}</p>
                </div>
              </div>
  
            </div>
  
            {/* Footer con botón */}
            <div className="p-6 bg-gray-50 border-t">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 transform">
                Volver al Inicio
              </button>
            </div>
  
          </div>
  
          {/* Mensaje adicional */}
          <p className="text-gray-600 text-center mt-6 max-w-md">
            Guarda tu número de pedido. Pronto recibirás tu orden.
          </p>
  
        </div>
      </div>
    )
}