import {  type ProductosResponse } from '@/interfaces/productos.interface';
import {  type ProductosResponseDetail } from '@/interfaces/productos.interface';
import { productoService } from '@/services/producto.servicio';
import { useEffect, useState } from 'react';
import  Header  from './ui/header'
import CategoryTabs from './ui/category_tabs';
import ProductGrid from './ui/grid_cards';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CartItem } from '@/interfaces/carrito.interface';
import { agregarCarrito } from '@/services/carrito.servicio';

export default function Terminal() {

  const [activeCategory, setActiveCategory] = useState(1);
  const [productos, setProductos] = useState<ProductosResponse[]>([])
  const [detalleProducto, setDetalleProducto] = useState<ProductosResponseDetail>()

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductosResponse>();

  async function obtenerProductos() {
    try {
        const productos = await productoService.obtenerProductos()

        setProductos(productos)
    }
    catch (error) {
        console.log("ERROR AL TRAER DATOS DE LA API")
    }
  }

  async function obtenerDetalleProducto(id_producto: number) {
    try {
      const detalleProducto = await productoService.obtenerDetalleProducto(id_producto)

      console.log("DETALLE PRODUCTO: ", detalleProducto)

      setDetalleProducto(detalleProducto)

    }
    catch (error) {
      console.log("ERROR AL TRAER DETALLE PRODUCTO " + error)
    }
  }

  async function agregarAlCarrito(product: CartItem) {
    try {
      console.log("carrito " + product.nombre)

      const cart = agregarCarrito(product);
      
      console.log("CARRITO ACTUALIZADO: ", cart);
      
    }
    catch (error) {

    }
  }

  useEffect(() => {
      obtenerProductos()
    }, []
  )
  
  const categories = [
    { id: 1, name: 'Hamburguesas', icon: 'burger.png' },
    { id: 2, name: 'Bebidas', icon: 'soft-drink.png' },
    { id: 3, name: 'Extras', icon: 'french-fries.png' }
  ];

  const filteredProducts = productos!.filter(
    product => product.id_categoria === activeCategory && product.disponible
  );

  function handleProductClick(product: ProductosResponse) {
    console.log("SE TOCÓ EL: " + product.nombre);
    obtenerDetalleProducto(product.id_producto)

    setSelectedProduct(product);
    setIsDialogOpen(true);
  }
  
  return (
    <div className="min-h-screen bg-red-50">

      <Header />

      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <ProductGrid
        products={filteredProducts}
        onProductClick={handleProductClick}
        onAddToCart={agregarAlCarrito}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          {/* Imagen del producto */}
          <div className="relative h-40 w-full">
            <img
              src={selectedProduct?.imagen_url}
              alt={selectedProduct?.nombre}
              className="w-full h-full object-cover"
            />
            
            {/* Badge de precio */}
            <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
              ${selectedProduct?.precio_base?.toFixed(2)}
            </div>
            
            {/* Overlay de no disponible */}
            {!selectedProduct?.disponible && (
              <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg">
                  No disponible
                </div>
              </div>
            )}
            
            {/* Botón de cerrar */}
            <DialogClose asChild>
            </DialogClose>
          </div>

          {/* Contenido */}
          <div className="p-4">
            {/* Header */}
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900">
                {selectedProduct?.nombre}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-sm">
                {selectedProduct?.descripcion}
              </DialogDescription>
            </DialogHeader>

            {/* Ingredientes */}
            {detalleProducto?.ingredientesBase && detalleProducto.ingredientesBase.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="text-red-600"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                  </svg>
                  Ingredientes
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detalleProducto.ingredientesBase.map((ingrediente) => (
                    <div 
                      key={ingrediente.id_ingrediente} 
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {ingrediente.nombre}
                          </h4>
                          <span className="text-xs text-red-600 font-bold ml-2">
                            {ingrediente.cantidad} {ingrediente.unidad_medida}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {ingrediente.descripcion}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border font-medium ml-3">
                        ${ingrediente.precio.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="gap-3">
              <DialogClose asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 h-10 font-medium border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </DialogClose>
              
              <Button 
                type="submit" 
                disabled={!selectedProduct?.disponible}
                className={`flex-1 h-10 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedProduct?.disponible
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                {selectedProduct?.disponible ? 'Agregar al carrito' : 'No disponible'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-500">
            En esta categoría no tenemos productos disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
}