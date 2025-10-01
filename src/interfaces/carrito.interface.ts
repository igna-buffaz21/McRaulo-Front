export type Extra = {
    id_extra: number;
    name: string;
    price: number;
  };
  
  export interface CartItem {
    id: string,
    id_producto: number;
    nombre: string;
    imagen_url: string;       
    precio_base: number;
    selected_extra: Extra[]; 
    notas?: string;
    subtotal: number;      
  }
  
  export interface CartTotals {
    items: number;
    subtotal: number;  
    discount: number;    
  }
  
  export interface Cart {
    id_cart: string;
    items: CartItem[];
    totales: CartTotals;
  }
  