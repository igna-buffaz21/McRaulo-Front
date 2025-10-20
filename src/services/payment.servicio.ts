import { api } from './api.config'
import { API_ROUTES } from '@/config/api-routes';
import type { CrearOrden } from '@/interfaces/payment.interface';

export const paymentService = {
    async crearOrden(cart: CrearOrden): Promise<any> {

        const response = await api.post<any[]>(API_ROUTES.PAYMENT.CREAR_ORDEN, cart);
       
        return response.data;

    },
}