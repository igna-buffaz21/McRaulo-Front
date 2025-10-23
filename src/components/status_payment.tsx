import { useSearchParams } from "react-router-dom"
import { useEffect } from "react";

export default function StatusPayment() {
    const [searchParams] = useSearchParams();

    const pedidoId = searchParams.get("external_reference")
    const paymentId = searchParams.get("payment_id")

    useEffect(() => {

        console.log("PEDIDO ID: " + pedidoId)
        console.log("PAGO ID: " + paymentId)

    }, [pedidoId, paymentId]
)

    return (
        <div>
            <h1>hola mundo 2</h1>
        </div>
    )
}