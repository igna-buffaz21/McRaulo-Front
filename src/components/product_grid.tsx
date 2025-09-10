import type { ProductosResponse } from '@/interfaces/productos.interface';
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

export default function Terminal() {

  const [activeCategory, setActiveCategory] = useState(1);
  const [productos, setProductos] = useState<ProductosResponse[]>()

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

  useEffect(() => {
      console.log(productos)

    }, [productos]
  )

  useEffect(() => {
      obtenerProductos()
    }, []
  )
  
  const products: ProductosResponse[] = [
    {
      id_producto: 1,
      nombre: "Big Mac",
      descripcion: "Doble carne, lechuga, queso, salsa especial",
      precio_base: 8.99,
      disponible: true,
      id_categoria: 1
    },
    {
      id_producto: 2,
      nombre: "Quarter Pounder",
      descripcion: "Carne de 1/4 libra, queso, cebolla",
      precio_base: 7.99,
      disponible: true,
      id_categoria: 1
    },
    {
      id_producto: 3,
      nombre: "Crispy Chicken",
      descripcion: "Pollo crispy, mayonesa, lechuga fresca",
      precio_base: 6.99,
      disponible: true,
      id_categoria: 1
    },
    {
      id_producto: 4,
      nombre: "Cheeseburger",
      descripcion: "Carne, queso, pepinillos, ketchup",
      precio_base: 4.99,
      disponible: true,
      id_categoria: 1
    },
    {
      id_producto: 5,
      nombre: "Coca-Cola",
      descripcion: "Refrescante bebida gasificada - tamaño mediano",
      precio_base: 2.99,
      disponible: true,
      id_categoria: 2
    },
    {
      id_producto: 6,
      nombre: "Sprite",
      descripcion: "Bebida de lima-limón - tamaño mediano",
      precio_base: 2.99,
      disponible: true,
      id_categoria: 2
    },
    {
      id_producto: 7,
      nombre: "Café McCafé",
      descripcion: "Café premium caliente recién preparado",
      precio_base: 3.49,
      disponible: true,
      id_categoria: 2
    },
    {
      id_producto: 8,
      nombre: "Jugo de Naranja",
      descripcion: "100% natural, sin conservantes",
      precio_base: 3.99,
      disponible: true,
      id_categoria: 2
    },
    {
      id_producto: 9,
      nombre: "Papas Fritas",
      descripcion: "Papas doradas y crocantes - tamaño mediano",
      precio_base: 3.49,
      disponible: true,
      id_categoria: 3
    },
    {
      id_producto: 10,
      nombre: "McNuggets",
      descripcion: "10 piezas de pollo con salsa a elección",
      precio_base: 5.99,
      disponible: true,
      id_categoria: 3
    },
    {
      id_producto: 11,
      nombre: "Apple Pie",
      descripcion: "Deliciosa tarta de manzana caliente",
      precio_base: 1.99,
      disponible: true,
      id_categoria: 3
    },
    {
      id_producto: 12,
      nombre: "McFlurry",
      descripcion: "Helado cremoso con M&M's o Oreo",
      precio_base: 4.49,
      disponible: true,
      id_categoria: 3
    }
  ];

  const categories = [
    { id: 1, name: 'Hamburguesas', icon: 'burger.png' },
    { id: 2, name: 'Bebidas', icon: 'soft-drink.png' },
    { id: 3, name: 'Extras', icon: 'french-fries.png' }
  ];

  const exampleProductDetail = {
    id_producto: 1,
    nombre: "McRaulo Cheese",
    descripcion: "Hamburguesa clásica con queso cheddar, preparada con ingredientes frescos y carne de res premium",
    precio_base: 8.99,
    disponible: true,
    id_categoria: 1,
    ingredientesBase: [
      {
        cantidad: 1,
        id_ingrediente: 2,
        nombre: "Carne de res",
        descripcion: "Medallón de carne de res 150g",
        precio: 2.5,
        unidad_medida: "unidad"
      },
      {
        cantidad: 15,
        id_ingrediente: 8,
        nombre: "Cebolla",
        descripcion: "Cebolla en rodajas",
        precio: 0.3,
        unidad_medida: "g"
      },
      {
        cantidad: 10,
        id_ingrediente: 12,
        nombre: "Ketchup",
        descripcion: "Salsa de tomate",
        precio: 0.2,
        unidad_medida: "ml"
      },
      {
        cantidad: 20,
        id_ingrediente: 6,
        nombre: "Lechuga",
        descripcion: "Lechuga fresca",
        precio: 0.3,
        unidad_medida: "g"
      },
      {
        cantidad: 1,
        id_ingrediente: 1,
        nombre: "Pan de hamburguesa",
        descripcion: "Pan brioche para hamburguesa",
        precio: 0.5,
        unidad_medida: "unidad"
      },
      {
        cantidad: 2,
        id_ingrediente: 5,
        nombre: "Queso cheddar",
        descripcion: "Feta de queso cheddar",
        precio: 0.75,
        unidad_medida: "unidad"
      },
      {
        cantidad: 15,
        id_ingrediente: 11,
        nombre: "Salsa especial",
        descripcion: "Salsa especial de la casa",
        precio: 0.5,
        unidad_medida: "ml"
      },
      {
        cantidad: 30,
        id_ingrediente: 7,
        nombre: "Tomate",
        descripcion: "Rodaja de tomate",
        precio: 0.4,
        unidad_medida: "g"
      }
    ]
  };

  const filteredProducts = products.filter(
    product => product.id_categoria === activeCategory && product.disponible
  );

  function handleProductClick(product: ProductosResponse) {
    console.log("SE TOCÓ EL: " + product.nombre);

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
      />

<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
    {/* Imagen del producto */}
    <div className="relative h-40 w-full">
      <img
        src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop&sig=${selectedProduct?.id_producto}`}
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
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
        </button>
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
      {exampleProductDetail?.ingredientesBase && exampleProductDetail.ingredientesBase.length > 0 && (
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
            {exampleProductDetail.ingredientesBase.map((ingrediente) => (
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

      {/* Precio total */}
      {exampleProductDetail?.ingredientesBase && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 text-sm">Total ingredientes:</span>
            <span className="font-bold text-red-600 text-lg">
              ${exampleProductDetail.ingredientesBase.reduce((total, ing) => total + (ing.precio * ing.cantidad), 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Botones */}
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