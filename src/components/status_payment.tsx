import { useSearchParams } from "react-router-dom"
import { useEffect } from "react";
import { paymentService } from "@/services/payment.servicio";

export default function StatusPayment() {
    const [searchParams] = useSearchParams();

    const pedidoId = searchParams.get("external_reference")
    const paymentId = searchParams.get("payment_id")

    useEffect(() => {

        console.log("PEDIDO ID: " + pedidoId)
        console.log("PAGO ID: " + paymentId)

        comprobarPago(Number(pedidoId), Number(paymentId))

    }, [pedidoId, paymentId]
)

    async function comprobarPago(idPedido: number, idPago: number) {
        try {
            const response = await paymentService.comprobarPago(idPedido, idPago);

            console.log("Respuesta de comprobación de pago:", response);
        }
        catch (error) {
            console.error("Error al comprobar el pago:", error);
        }
    }

    return (
        <div>
            <h1>hola mundo 3</h1>
        </div>
    )
}