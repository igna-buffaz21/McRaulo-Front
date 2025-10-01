export interface ProductosResponse {
    id_producto: number,
    nombre: string,
    descripcion: string,
    precio_base: number,
    disponible: boolean,
    id_categoria: number,
    imagen_url: string
}

export interface ProductGridProps {
    products: ProductosResponse[];
    onProductClick: (product: ProductosResponse) => void;
    onAddToCart: any
}

export interface ingredientesBase {
    cantidad: number;
    id_ingrediente: number;
    nombre: string;
    descripcion: string;
    precio: number;
    unidad_medida: string;
  }
  
  export interface ProductosResponseDetail {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    disponible: boolean;
    id_categoria: number;
    ingredientesBase: ingredientesBase[];
  }