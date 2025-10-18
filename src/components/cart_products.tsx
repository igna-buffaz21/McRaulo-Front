import type { Cart, Extra } from '@/interfaces/carrito.interface';
import { loadCart, modificarItem, removeItem } from '@/services/carrito.servicio';
import React, { useEffect, useState } from 'react';
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
import { productoService } from '@/services/producto.servicio';
import type { IngredienteAModificarBurger } from '@/interfaces/productos.interface';

export default function CartProducts() {
  const [cartItems, setCartItems] = useState<Cart>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ingredientes, setIngredientes] = useState<IngredienteAModificarBurger[]>([]);
  const [ingredientesLocal, setIngredientesLocal] = useState<IngredienteAModificarBurger[]>([]);

  const navigate = useNavigate();

  ///
  
  ///

  useEffect(() => {
    obtenerCarrito();
  }, []);



  useEffect(() => {
    if (ingredientes.length > 0) {
      const clonados = ingredientes.map((i) => ({
        ...i,
        cantidad_base: i.cantidad,
        cantidad: i.cantidad,
      }));
      setIngredientesLocal(clonados);
    }
  }, [ingredientes]);
  


  useEffect(() => {
    console.log(ingredientes);
  }, [ingredientes]);

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

  async function obtenerIngredientesModificables(id: number) {
    try {
      const response = await productoService.obtenerIngredienteAModificar(id);

      setIngredientes(response);
      
    }
    catch (error) {
      console.error("Error al obtener los ingredientes a modificar:", error);
    }
  }

  function modificarIngredientes(id: number) {
    obtenerIngredientesModificables(id);
    setIsDialogOpen(true);
  }

  function handleConfirmarCambios(id_producto: string) {
    // Comparamos el estado original con el modificado
    const cambios: Extra[] = ingredientesLocal
      .map((local) => {
        const original = ingredientes.find(
          (i) => i.id_ingrediente === local.id_ingrediente
        );
  
        if (!original) return null;
  
        const diferencia = local.cantidad - original.cantidad;
  
        // sin cambios
        if (diferencia === 0) return null;
  
        return {
          id_ingrediente: local.id_ingrediente,
          es_extra: diferencia > 0,
          cantidad: Math.abs(diferencia),
          price: local.precio * Math.abs(diferencia),
        };
      })
      .filter(Boolean) as Extra[];
  
    // Guardamos los cambios en el carrito local
    modificarItem(id_producto.toString(), { selected_extra: [cambios] });
  
    // Cerrar el modal y refrescar carrito
    setIsDialogOpen(false);
    obtenerCarrito();
  }
  

  function handleCantidadChange(id: number, tipo: 'add' | 'remove') {
    setIngredientesLocal(prev =>
      prev.map((i) => {
        if (i.id_ingrediente !== id) return i;
  
        const incremento = tipo === 'add' ? 1 : -1;
        const nuevaCantidad = i.cantidad + incremento;
  
        // 🚨 Este es el punto importante
        const limiteMin = i.remove ? 0 : i.cantidad;
        const limiteMax = i.max ?? 5;
  
        // Evitar que se salga de rango
        if (nuevaCantidad < limiteMin || nuevaCantidad > limiteMax) return i;
  
        return { ...i, cantidad: nuevaCantidad };
      })
    );
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
                      onClick={() => modificarIngredientes(item.id_producto)}
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105 transform text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pagar Pedido
            </button>
            
            <button 
            onClick={backtoHome}
            className="px-6 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar más
            </button>
          </div>
        </div>


        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden max-h-[80vh] flex flex-col">
        {/* Imagen del producto */}
          <div className="relative h-40 w-full flex-shrink-0">
            <img
              src={ingredientes[0]?.imagen_url}
              alt={ingredientes[0]?.nombreburger}
              className="w-full h-full object-cover"
            />
          
            <DialogClose asChild>
            </DialogClose>
          </div>

          {/* Contenido scrolleable */}
          <div className="p-4 overflow-y-auto flex-1">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {ingredientes[0]?.nombreburger}
              </DialogTitle>
            </DialogHeader>

            {/* Ingredientes Modificables */}
            {ingredientes && ingredientes.length > 0 && (
              <div className="mb-4">                
                <div className="space-y-2">
                {ingredientesLocal.map((ingrediente) => {
                  const cantidadActual = ingrediente.cantidad;
                  const cantidadBase = ingrediente.cantidad;
                  const cantidadMax = ingrediente.max;
                  const puedeAgregar = ingrediente.add;
                  const puedeEliminar = ingrediente.remove;

                  return (
                    <div
                      key={ingrediente.id_ingrediente}
                      className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-gray-200 shadow-sm"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {ingrediente.nombre}
                          </h4>
                          {ingrediente.precio > 0 && (
                            <span className="text-xs text-red-600 font-bold ml-2 whitespace-nowrap">
                              +${ingrediente.precio.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controles */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Botón "-" */}
                        <button
                          onClick={() => handleCantidadChange(ingrediente.id_ingrediente, 'remove')}
                          disabled={!puedeEliminar && cantidadActual <= cantidadBase}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            (!puedeEliminar && cantidadActual <= cantidadBase)
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>

                        {/* Cantidad actual */}
                        <span className="w-8 text-center font-semibold text-gray-900 select-none">
                          {cantidadActual}
                        </span>

                        {/* Botón "+" */}
                        <button
                          onClick={() => handleCantidadChange(ingrediente.id_ingrediente, 'add')}
                          disabled={!puedeAgregar || cantidadActual >= cantidadMax}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            (!puedeAgregar || cantidadActual >= cantidadMax)
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-md'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            )}
          </div>

          {/* Footer fijo */}
          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Precio total:</span>
                <span className="text-2xl font-bold text-red-600">
                
                </span>
              </div>
            </div>

            <DialogFooter className="gap-3">
            <Button 
                type="submit" 
                className={`flex-1 h-10 font-medium transition-all duration-200 flex items-center justify-center gap-2`}
              >
                Modificar
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
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