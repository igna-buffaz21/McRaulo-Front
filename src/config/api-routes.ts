import { API_URL } from './env'

export const API_ROUTES = {
    PRODUCTOS: {
        OBTENER_TODOS: `${API_URL}/api/productos/obtenerProductos`,
        OBTENER_DETALLE_PRODUCTO: (id: number) => `${API_URL}/api/productos/obtenerProductoEspecificoConIngredientes/${id}`,
        OBTENER_INGREDIENTES_A_MODIFICAR: (id: number) => `${API_URL}/api/productos/obtenerIngredientesParaModificar/${id}`
    },
    PAYMENT: {
        CREAR_ORDEN: `${API_URL}/api/payment/crearOrden`,
        COMPROBAR_PAGO: (idPedido: number, idPago: number) => `${API_URL}/api/payment/comprobarPago?idPedido=${idPedido}&idPago=${idPago}`
    },
    PEDIDO: {
        OBTENER_PEDIDO_PENDIENTE_DE_PAGO: (idPedido: number) => `${API_URL}/api/pedidos/obtenerPedidoPendienteDePago?idPedido=${idPedido}`,
        MARCAR_PEDIDO_PAGADO: `${API_URL}/api/pedidos/CrearPago`,
        OBTENER_PEDIDOS_PENDIENTES: `${API_URL}/api/pedidos/obtenerPedidosPendientes`,
        OBTENER_PEDIDOS_PREPARACION: `${API_URL}/api/pedidos/obtenerPedidosPreparacion`,
        OBTENER_PEDIDOS_LISTOS: `${API_URL}/api/pedidos/obtenerPedidosListos`,
        OBTENER_DETALLE_PEDIDO: (idPedido: number) => `${API_URL}/api/pedidos/obtenerDetallePedido?idPedido=${idPedido}`,
        CAMBIAR_ESTADO_PEDIDO: (idPedido: number, estado: string) => `${API_URL}/api/pedidos/cambiarEstadoPedido?idPedido=${idPedido}&estado=${estado}`
    }
}