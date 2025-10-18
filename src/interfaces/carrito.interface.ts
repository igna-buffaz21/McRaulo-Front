  export interface CartItem {
    id: string,
    id_producto: number;
    nombre: string;
    imagen_url: string;       
    precio_base: number;
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
  