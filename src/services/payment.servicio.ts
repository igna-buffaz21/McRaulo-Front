import { api } from './api.config'
import { API_ROUTES } from '@/config/api-routes';
import type { ComprobarPagoResponse, CrearOrden, ResponseOrden } from '@/interfaces/payment.interface';

export const paymentService = {
    async crearOrden(cart: CrearOrden): Promise<ResponseOrden> {

        const response = await api.post<ResponseOrden>(API_ROUTES.PAYMENT.CREAR_ORDEN, cart);
       
        return response.data;

    },
    async comprobarPago(pedidoId: number, paymentId: number): Promise<ComprobarPagoResponse[]> {
        const response = await api.get<ComprobarPagoResponse[]>(API_ROUTES.PAYMENT.COMPROBAR_PAGO(pedidoId, paymentId));

        return response.data;

    }
}