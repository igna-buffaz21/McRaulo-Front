import type { Cart, CartItem } from "./carrito.interface";
import type { Checkout } from "./checkout.interface";

export interface CrearOrden{
    cart_products: CartItem[],
    checkout_steps: Checkout
}