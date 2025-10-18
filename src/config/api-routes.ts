import { API_URL } from './env'

export const API_ROUTES = {
    PRODUCTOS: {
        OBTENER_TODOS: `${API_URL}/api/productos/obtenerProductos`,
        OBTENER_DETALLE_PRODUCTO: (id: number) => `${API_URL}/api/productos/obtenerProductoEspecificoConIngredientes/${id}`,
        OBTENER_INGREDIENTES_A_MODIFICAR: (id: number) => `${API_URL}/api/productos/obtenerIngredientesParaModificar/${id}`,
        
    },
}