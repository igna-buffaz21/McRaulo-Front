import type { Cart } from "@/interfaces/carrito.interface";
import { loadCart } from "@/services/carrito.servicio";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [cartItems, setCartItems] = useState<Cart>();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerCarrito();
  }, []);

  // Función para actualizar el carrito
  function obtenerCarrito() {
    const cart = loadCart();
    setCartItems(cart);
  }

  // Escuchar cambios en el carrito
  useEffect(() => {
    const handleStorageChange = () => {
      obtenerCarrito();
    };

    // Escuchar eventos personalizados del carrito
    window.addEventListener('cartUpdated', handleStorageChange);
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function navegarCarrito() {
    navigate("/carrito");
  }

  // Total de items en el carrito
  const totalItems = cartItems?.items.length || 0;

  return (
    <div className="bg-red-600 text-white p-4 shadow-lg relative">
      {/* Ícono carrito con badge */}
      <div 
        onClick={navegarCarrito}
        className="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer group"
      >
        <img
          src="/grocery-store.png"
          alt="Carrito"
          className="w-6 h-6 group-hover:scale-110 transition-transform"
        />
        
      {/* Badge con número de items */}
      {totalItems > 0 && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
          {totalItems > 9 ? '9+' : totalItems}
        </div>
      )}
      </div>

      {/* Texto centrado */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">¡Haz tu pedido!</h1>
        <p className="text-sm opacity-90">Selecciona tus productos favoritos</p>
      </div>
    </div>
  );
}