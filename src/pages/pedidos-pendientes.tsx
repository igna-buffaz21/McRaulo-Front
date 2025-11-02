import { useEffect, useState } from "react"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import type { Pedido } from "@/interfaces/pedido.interface"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pedidoService } from "@/services/pedido.servicio"
import { ESTADO_PEDIDO } from "@/config/const"


export function PedidosPendientes() {
  const [openDialogSuccess, setOpenDialogSuccess] = useState(false);
  const [openDialogAlert, setOpenDialogAlert] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const formatearFecha = (timestamp: number): string => {
    const fecha = new Date(timestamp * 1000);
    return fecha.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  async function obtenerPedidosPendientes() {
    try {
        const response = await pedidoService.ObtenerPedidosPendientes();

        setPedidos(response);
    }
    catch (error) {
        console.log(error)
    }
  }

  async function cambiarAPreparacion(id_pedido: number) {
    try {
        const response = await pedidoService.cambiarEstadoPedido(id_pedido, ESTADO_PEDIDO.EN_PREPARACION)

        console.log(response);

        obtenerPedidosPendientes();
    }
    catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    obtenerPedidosPendientes();

    const interval = setInterval(() => {
        console.log("se actualizo")
      obtenerPedidosPendientes();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

        <div className="p-6">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold">Pedidos Pendientes</h2>
            <p className="text-sm text-muted-foreground">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} esperando preparación
            </p>
          </div>

          {pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No hay pedidos pendientes</p>
              <p className="text-sm text-muted-foreground">
                Los nuevos pedidos aparecerán aquí
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>Lista de pedidos pendientes de preparación</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">NUMERO</TableHead>
                  <TableHead>FECHA</TableHead>
                  <TableHead className="text-right">PREPARACION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id_pedido}>
                    <TableCell className="font-medium">
                      #{pedido.id_pedido}
                    </TableCell>
                    <TableCell>{formatearFecha(pedido.fecha_hora)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => cambiarAPreparacion(pedido.id_pedido)}
                        size="sm"
                        className="gap-2"
                      >
                        Mover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
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
              <AlertDialogTitle className="text-lg">
                Pedido enviado a preparación
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              El pedido se ha movido exitosamente al área de preparación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpenDialogSuccess(false)}>
              Continuar
            </AlertDialogAction>
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
              <AlertDialogTitle className="text-lg">
                Error al cambiar estado
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              No se pudo cambiar el estado del pedido. Por favor intenta nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setOpenDialogAlert(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}