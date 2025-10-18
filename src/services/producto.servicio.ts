import type { IngredienteAModificarBurger, ProductosResponse, ProductosResponseDetail } from '@/interfaces/productos.interface';
import { api } from './api.config'
import { API_ROUTES } from '@/config/api-routes';

export const productoService = {
    async obtenerProductos(): Promise<ProductosResponse[]> {

        const response = await api.get<ProductosResponse[]>(API_ROUTES.PRODUCTOS.OBTENER_TODOS);
       
        return response.data;

    },

    async obtenerDetalleProducto(id: number): Promise<ProductosResponseDetail> {

        const response = await api.get<ProductosResponseDetail>(API_ROUTES.PRODUCTOS.OBTENER_DETALLE_PRODUCTO(id))

        return response.data

    },

    async obtenerIngredienteAModificar(id: number) : Promise<IngredienteAModificarBurger[]> {

        const response = await api.get<IngredienteAModificarBurger[]>(API_ROUTES.PRODUCTOS.OBTENER_INGREDIENTES_A_MODIFICAR(id))

        return response.data

    }
}