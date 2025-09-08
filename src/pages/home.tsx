import { ProductGrid } from "@/components/ui/product_grid";
import type { ProductosResponse } from "@/interfaces/productos.interface";
import { productoService } from "@/services/producto.servicio";
import { useEffect, useState } from "react";

export function Home() {

  const [productos, setProductos] = useState<ProductosResponse[]>([]);


    async function obtenerProductos() {
      try {
        const response = await productoService.obtenerProductos()

        response.forEach(item =>
          console.log("nombre " + item.nombre)
        )

        setProductos(response)

        console.log(productos)

      }
      catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      obtenerProductos();
    }, []
  )

    return(
      <>
        <ProductGrid></ProductGrid>
      </>
    );

}