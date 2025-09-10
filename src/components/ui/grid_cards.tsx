import type { ProductGridProps } from "@/interfaces/productos.interface";

  export default function ProductGrid({ 
    products,
    onProductClick 
    }: ProductGridProps) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              onClick={() => onProductClick(product)}
              key={product.id_producto}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 overflow-hidden cursor-pointer"
            >
              <div className="relative">
                <img
                  src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop&sig=${product.id_producto}`}
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
                  disabled={!product.disponible}
                  className={`w-full font-medium py-2 px-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2 ${
                    product.disponible
                      ? 'bg-red-600 hover:bg-red-700 text-white'
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
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  {product.disponible ? 'Seleccionar' : 'No disponible'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }