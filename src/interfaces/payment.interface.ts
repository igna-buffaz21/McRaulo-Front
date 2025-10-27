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

export interface ComprobarPagoResponse{
    id_pedido: number,
    fecha_hora: number,
    tipo: string,
    estado_pago: string
}

/*

    {
        "id_pedido": 74,
        "fecha_hora": 1761331655,
        "tipo": "dine-in",
        "estado_pago": "approved"
    }

*/


/*
                message: "Pedido creado con Mercado Pago",
                type: METODO_PAGO.EFECTIVO,
                idPedido,
                init_point: result.sandbox_init_point,
*/