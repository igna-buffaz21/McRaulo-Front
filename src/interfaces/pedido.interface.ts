export interface Pedido {
    id_pedido: number,
    fecha_hora: number,
    total: number,
    estado: string,
    metodo_pago: string,
    tipo: string
}

export interface PedidosPreparacion {
    id_pedido: number,
    nombre: string,
    notas?: string
}

/*

        "id_pedido": 89,
        "nombre": "Papas fritas",
        "notas": null


        "id_pedido": 89,
        "fecha_hora": 1761949931,
        "tipo": "dine-in",
        "nombre": "Agua mineral",
        "notas": null

*/

/*
        "id_pedido": 89,
        "fecha_hora": 1761949931,
        "total": 44.94,
        "estado": "pendiente_pago",
        "metodo_pago": "cash",
        "tipo": "dine-in"

*/