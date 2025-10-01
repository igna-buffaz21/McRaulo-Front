import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate()

  function navegarCarrito() {
    navigate("/carrito")
  }

  return (
    <div className="bg-red-600 text-white p-4 shadow-lg relative">
      {/* Ícono carrito */}
      <img
        onClick={navegarCarrito}
        src="/grocery-store.png"
        alt="Carrito"
        className="w-6 h-6 absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
      />

      {/* Texto centrado */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">¡Haz tu pedido!</h1>
        <p className="text-sm opacity-90">Selecciona tus productos favoritos</p>
      </div>
    </div>
  );
}
