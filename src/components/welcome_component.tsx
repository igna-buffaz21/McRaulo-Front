import { clearCart } from "@/services/carrito.servicio";
import { clearCheckout } from "@/services/checkout.servicio";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export default function WelcomeComponent() {
    useEffect(() => {
        console.log("Bienvenido a McRaulo!");

        clearCheckout();
        clearCart();

    }, []
    )

    const navigate = useNavigate();

    function iniciarPedido() {
        navigate('/productos');
    }

    return(
        <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-8">
      
        <div className="max-w-2xl w-full text-center">
          
          {/* Logo grande y limpio */}
          <div className="mb-16">
            <h1 className="text-8xl font-bold text-white mb-6 tracking-tight">
              McRaulo
            </h1>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>
  
          {/* Card de acción */}
          <div className="bg-white rounded-3xl shadow-2xl p-16 mb-8">
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Listo para ordenar?
            </h2>
            
            <p className="text-gray-600 text-lg mb-10">
              Las mejores hamburguesas a un toque de distancia
            </p>
  
            <button
              onClick={iniciarPedido}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-200 text-2xl hover:shadow-xl"
            >
              Iniciar Pedido
            </button>
  
          </div>
        </div>
      </div>
    )
}