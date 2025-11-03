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
import { Skeleton } from "@/components/ui/skeleton";

export default function Terminal() {

  const [activeCategory, setActiveCategory] = useState(1);
  const [productos, setProductos] = useState<ProductosResponse[]>([])
  const [detalleProducto, setDetalleProducto] = useState<ProductosResponseDetail>()
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isLoadingDetalle, setIsLoadingDetalle] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductosResponse>();

  async function obtenerProductos() {
    try {
        const productos = await productoService.obtenerProductos()

        setProductos(productos)

        setIsLoading(false);
    }
    catch (error) {
        console.log("ERROR AL TRAER DATOS DE LA API")
    }
  }

  async function obtenerDetalleProducto(id_producto: number) {
    try {
      setIsLoadingDetalle(true);
      const detalleProducto = await productoService.obtenerDetalleProducto(id_producto)

      console.log("DETALLE PRODUCTO: ", detalleProducto)

      setDetalleProducto(detalleProducto)
      setIsLoadingDetalle(false);

    }
    catch (error) {
      console.log("ERROR AL TRAER DETALLE PRODUCTO " + error)
    }
  }

  async function agregarAlCarrito(product: CartItem) {
    try {
      console.log("carrito " + product.nombre)

      const cart = agregarCarrito(product);

      window.dispatchEvent(new Event('cartUpdated'));
      
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
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          {isLoadingDetalle ? (
            // Skeleton Loading
            <>
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                
                <div className="space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
                
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </>
          ) : (
            <>
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
                
                {/* Botón de cerrar */}
                <DialogClose asChild>
                </DialogClose>
              </div>

              {/* Contenido */}
              <div className="p-5">
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
                {detalleProducto?.ingredientesBase && detalleProducto.ingredientesBase.length > 0 ? (
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
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto">
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
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 text-center py-8 text-gray-500">
                    <p className="text-sm">No hay ingredientes disponibles para este producto</p>
                  </div>
                )}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-10 font-medium border-gray-300 hover:bg-gray-50"
                    >
                      Cerrar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}