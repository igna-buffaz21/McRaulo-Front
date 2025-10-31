import type { Cart, CartItem } from '@/interfaces/carrito.interface';
import { loadCart, modificarItem, removeItem } from '@/services/carrito.servicio';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CartProducts() {
  const [cartItems, setCartItems] = useState<Cart>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<CartItem | null>(null);
  const [notaTemporal, setNotaTemporal] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    obtenerCarrito();
  }, []);

  function obtenerCarrito() {
    setCartItems(loadCart())
  }

  function removeItemC(id: string) {
    const cart = removeItem(id);
    setCartItems(cart);
  }

  function backtoHome() {
    navigate('/productos');
  }

  function goToPayment() {
    navigate('/pago');
  }

    function abrirDialogNotas(item: CartItem) {
    setProductoSeleccionado(item);
    setNotaTemporal(item.notas || "");
    setIsDialogOpen(true);
  }

  function handleGuardarNota() {
    if (!productoSeleccionado) return;
    modificarItem(productoSeleccionado.id, { notas: notaTemporal });
    setIsDialogOpen(false);
    obtenerCarrito();
  }

  const total = cartItems?.totales.subtotal || 0

  const totalItems = cartItems?.items.length || 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header rojo arriba */}
      <div className="bg-red-600 text-white p-6 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
              onClick={backtoHome}
              className="p-2 hover:bg-red-700 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Tu Pedido</h1>
            </div>
            <div className="bg-red-700 px-4 py-2 rounded-full">
              <span className="text-lg font-medium">{totalItems} productos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido central - Ahora con padding y espacio flexible */}
      <div className="flex-1 flex flex-col items-center py-8 px-4 gap-6">
        
        {/* VENTANA 1: Lista de productos con scroll interno - MISMO ANCHO QUE EL RESUMEN */}
        <div className="w-full max-w-2xl h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Productos en tu carrito</h2>
            <p className="text-gray-600">Modifica cantidades o elimina productos</p>
          </div>
          
          {/* AQUÍ ES EL SCROLL INTERNO */}
          <div className="h-72 overflow-y-auto p-4">
            <div className="space-y-3">
            {cartItems?.items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{item.nombre}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-600 text-lg">
                        ${item.precio_base}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Botón de editar (solo lápiz) */}
                    <button
                      onClick={() => abrirDialogNotas(item)}
                      className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232a2.5 2.5 0 113.536 3.536L7.5 20.036l-4 1 1-4L15.232 5.232z"
                        />
                      </svg>
                    </button>

                    {/* Botón de eliminar */}
                    <button
                      onClick={() => removeItemC(item.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            </div>
          </div>
        </div>

        {/* VENTANA 2: Resumen y botón de pagar - MISMO ANCHO */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Resumen del pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                <span className="text-gray-900 font-medium">${total}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-red-600">${(total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={goToPayment}
              disabled={totalItems === 0}
              className={`flex-1 font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-xl ${
                totalItems === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105 transform'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pagar Pedido
            </button>

            <button 
              onClick={backtoHome}
              className="px-6 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar más
            </button>
          </div>
        </div>


        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden flex flex-col">
            {/* Imagen del producto */}
            <div className="relative h-40 w-full flex-shrink-0">
              <img
                src={productoSeleccionado?.imagen_url || "/placeholder.png"}
                alt={productoSeleccionado?.nombre || "Producto"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido principal */}
            <div className="p-6 flex-1 flex flex-col">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {productoSeleccionado?.nombre || "Producto"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1">
                <label className="block text-gray-700 font-semibold mb-2">
                  Notas para este producto
                </label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none text-gray-800"
                  placeholder="Ejemplo: sin cebolla, con poco condimento, extra queso..."
                  value={notaTemporal}
                  onChange={(e) => setNotaTemporal(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Estas notas se guardarán junto con este producto.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-white flex-shrink-0">
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  onClick={() => handleGuardarNota()}
                  className="flex-1 h-10 font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  Guardar nota
                </Button>

                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 font-medium border-gray-300 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}