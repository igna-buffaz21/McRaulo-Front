export interface ProductosResponse {
    id_producto: number,
    nombre: string,
    descripcion: string,
    precio_base: number,
    disponible: boolean,
    id_categoria: number
}

export interface ProductGridProps {
    products: ProductosResponse[];
    onProductClick: (product: ProductosResponse) => void;
}

export interface IngredienteBase {
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
    ingredientesBase: IngredienteBase[];
  }