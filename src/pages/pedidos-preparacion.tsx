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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pedidoService } from "@/services/pedido.servicio"
import { ESTADO_PEDIDO } from "@/config/const"
import type { Pedido, PedidosPreparacion } from "@/interfaces/pedido.interface"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

export function PedidosPreparacionC() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [detallePedido, setDetallePedido] = useState<PedidosPreparacion[]>([])
  const [openDialog, setOpenDialog] = useState(false);

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

  async function obtenerPedidosPreparacion() {
    try {
        const response = await pedidoService.ObtenerPedidosPreparacion();

        setPedidos(response);
    }
    catch (error) {
        console.log(error)
    }
  }

  async function cambiarAListo(id_pedido: number) {
    try {
        const response = await pedidoService.cambiarEstadoPedido(id_pedido, ESTADO_PEDIDO.LISTO)

        console.log(response);

        obtenerPedidosPreparacion();
    }
    catch (error) {
        console.log(error)
    }
  }

  async function obtenerDetallePedido(id_pedido: number) {
    try {
        const response = await pedidoService.obtenerDetallePedido(id_pedido)

        setDetallePedido(response)
    }
    catch (error) {
        console.log("ERROR " + error)
    }
  }

  function abrirDetalle(id_pedido: number) {
    obtenerDetallePedido(id_pedido)

    setOpenDialog(true)
  }

  useEffect(() => {
    obtenerPedidosPreparacion();

    const interval = setInterval(() => {
        console.log("se actualizo")
        obtenerPedidosPreparacion();
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
            <h2 className="text-2xl font-bold">Pedidos Pendientes de Preparacion</h2>
            <p className="text-sm text-muted-foreground">
              {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} esperando preparación
            </p>
          </div>

          {pedidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No hay pedidos pendientes de preparacion</p>
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
                  <TableHead className="text-right">DETALLE</TableHead>
                  <TableHead className="text-right">LISTO</TableHead>
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
                        onClick={() => abrirDetalle(pedido.id_pedido)}
                        size="sm"
                        className="gap-2"
                      >
                        Ver
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => cambiarAListo(pedido.id_pedido)}
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
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del Pedido #{detallePedido[0]?.id_pedido}</DialogTitle>
              <DialogDescription>
                Lista de productos incluidos en este pedido
              </DialogDescription>
            </DialogHeader>

            {detallePedido.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay productos cargados para este pedido
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detallePedido.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{detalle.nombre}</TableCell>
                      <TableCell>{detalle.notas ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <DialogFooter className="pt-4">
              <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}