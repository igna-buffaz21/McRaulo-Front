import type { CartItem } from "./carrito.interface";
import type { Checkout } from "./checkout.interface";

export interface CrearOrden{
    cart_products: CartItem[],
    checkout_steps: Checkout
}

export interface ResponseOrden{
    message: string,
    type: string,
    idPedido: number,
    init_point?: string
}


/*
                message: "Pedido creado con Mercado Pago",
                type: METODO_PAGO.EFECTIVO,
                idPedido,
                init_point: result.sandbox_init_point,
*/