import type { Pedido, PedidosPreparacion } from '@/interfaces/pedido.interface';
import { api } from './api.config'
import { API_ROUTES } from '@/config/api-routes';

export const pedidoService = {
    async obtenerPedidoPendienteDePago(id_pedido: number): Promise<Pedido[]> {

        const response = await api.get<Pedido[]>(API_ROUTES.PEDIDO.OBTENER_PEDIDO_PENDIENTE_DE_PAGO(id_pedido));
       
        return response.data;

    },
    async CrearPagoEfectivo(id_pedido: number) : Promise<any> {

        const body = {id_pedido: id_pedido}

        const response = await api.post<any>(API_ROUTES.PEDIDO.MARCAR_PEDIDO_PAGADO, body);

        return response.data;

    },

    async ObtenerPedidosPendientes() : Promise<Pedido[]> {

        const response = await api.get<Pedido[]>(API_ROUTES.PEDIDO.OBTENER_PEDIDOS_PENDIENTES);

        return response.data;
    },

    async cambiarEstadoPedido(id_pedido: number, estado: string) : Promise<any> {

        const response = await api.get<any>(API_ROUTES.PEDIDO.CAMBIAR_ESTADO_PEDIDO(id_pedido, estado))

        return response.data;
    },

    async ObtenerPedidosPreparacion() : Promise<Pedido[]> {

        const response = await api.get<Pedido[]>(API_ROUTES.PEDIDO.OBTENER_PEDIDOS_PREPARACION);

        return response.data;
    },

    async obtenerDetallePedido(id_pedido: number) : Promise<PedidosPreparacion[]> {

        const response = await api.get<PedidosPreparacion[]>(API_ROUTES.PEDIDO.OBTENER_DETALLE_PEDIDO(id_pedido));

        return response.data;
    },

    async ObtenerPedidosListos() : Promise<Pedido[]> {

        const response = await api.get<Pedido[]>(API_ROUTES.PEDIDO.OBTENER_PEDIDOS_LISTOS);

        return response.data;
    }
}