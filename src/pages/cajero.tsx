import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Search } from "lucide-react"
import type { Pedido } from "@/interfaces/pedido.interface"
import { pedidoService } from "@/services/pedido.servicio"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

export function Cajero() {
  const [numeroPedido, setNumeroPedido] = useState("")
  const [pedidoEncontrado, setPedidoEncontrado] = useState<Pedido[]>([])
  const [buscando, setBuscando] = useState(false)
  const [openDialogSuccess, setOpenDialogSuccess] = useState(false);
  const [openDialogAlert, setOpenDialogAlert] = useState(false);

  const buscarPedido = async () => {
    if (!numeroPedido.trim()) return

    setBuscando(true)

    try {
        const response = await pedidoService.obtenerPedidoPendienteDePago(Number(numeroPedido));

        if (response.length === 0) {
            setOpenDialogAlert(true)
        }

        setPedidoEncontrado(response);
        setBuscando(false)
    }
    catch (error) {
        setOpenDialogAlert(true)
        console.error("Error al obtener el pedido:", error);
        setPedidoEncontrado([]);
        setBuscando(false)
    }
  }

  const confirmarPedido = async () => {
    try {
        const response = await pedidoService.CrearPagoEfectivo(pedidoEncontrado[0].id_pedido)

        console.log("RESPONSE " + response)

        setOpenDialogSuccess(true);
    }
    catch (error) {
        console.log("ERROR " + error)
    }
    
    // Limpiar después de confirmar
    setNumeroPedido("")
    setPedidoEncontrado([])
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      buscarPedido()
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>McRaulo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 items-center justify-center">
          <div className="max-w-2xl w-full space-y-4">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Búsqueda de Pedidos</h2>
              <p className="text-muted-foreground">
                Ingresa el número de pedido para buscar
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Número de pedido"
                value={numeroPedido}
                onChange={(e) => setNumeroPedido(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={buscarPedido}
                disabled={buscando || !numeroPedido.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                {buscando ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {pedidoEncontrado.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pedido #{pedidoEncontrado[0]?.id_pedido}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha y Hora:</span>
                    <span className="font-medium">{pedidoEncontrado[0]?.fecha_hora}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monto Total:</span>
                    <span className="font-bold text-lg">
                      ${pedidoEncontrado[0]?.total.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={confirmarPedido}
                    className="w-full"
                  >
                    Confirmar Pedido
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>

      <AlertDialog open={openDialogSuccess} onOpenChange={setOpenDialogSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <AlertDialogTitle className="text-lg">Pedido pagado con exito!</AlertDialogTitle>
              <AlertDialogDescription className="pt-4">
            </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
            onClick={() => {}}
            >Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDialogAlert} onOpenChange={setOpenDialogAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <AlertDialogTitle className="text-lg">No se encontro ningun pedido</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Entendido</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </SidebarProvider>
  )
}