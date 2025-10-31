import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductGridProps } from "@/interfaces/productos.interface";

interface ExtendedProductGridProps extends ProductGridProps {
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  isLoading = false
}: ExtendedProductGridProps) {
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    setAddedProducts(prev => new Set(prev).add(product.id_producto));
    onAddToCart(product);
    
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id_producto);
        return newSet;
      });
    }, 2000);
  };

  // Skeleton Loading
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Skeleton className="h-32 w-full rounded-none" />
              <div className="p-3 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {products.map((product) => {
          const isAdded = addedProducts.has(product.id_producto);
          
          return (
            <div
              onClick={() => onProductClick(product)}
              key={product.id_producto}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={product.imagen_url}
                  alt={product.nombre}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  ${product.precio_base.toFixed(2)}
                </div>
                {!product.disponible && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                      No disponible
                    </span>
                  </div>
                )}
              </div>
                           
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">
                  {product.nombre}
                </h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {product.descripcion}
                </p>
                               
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={!product.disponible || isAdded}
                  className={`w-full font-medium py-2 px-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                    isAdded
                      ? 'bg-green-500 text-white scale-95'
                      : product.disponible
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="animate-bounce"
                      >
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                      </svg>
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                      Añadir al Carrito
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}