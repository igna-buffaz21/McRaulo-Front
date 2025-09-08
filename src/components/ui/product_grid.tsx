"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: number
  name: string
  brand: string
  price: number
  discountPrice?: number
  image: string
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // 🚨 Acá podrías llamar a tu API o servicio de productos
    // Por ahora te dejo un mock de ejemplo
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Product One",
        brand: "Brand A",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1646753522408-077ef9839300?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        name: "Product Two",
        brand: "Brand B",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1651950519238-15835722f8bb?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Product Three",
        brand: "Brand C",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Product Three",
        brand: "Brand C",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Product Three",
        brand: "Brand C",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Product Three",
        brand: "Brand C",
        price: 149,
        discountPrice: 199,
        image:
          "https://images.unsplash.com/photo-1651950537598-373e4358d320?auto=format&fit=crop&w=500&q=60",
      },
    ]
    setProducts(mockProducts)
  }, [])

  return (
    <div className="text-center p-10">
      <h1 className="font-bold text-4xl mb-4">Responsive Product card grid</h1>
      <h1 className="text-3xl">Tailwind CSS</h1>

      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
          >
            <a href="#">
              <img
                src={product.image}
                alt={product.name}
                className="h-80 w-72 object-cover rounded-t-xl"
              />
              <div className="px-4 py-3 w-72">
                <span className="text-gray-400 mr-3 uppercase text-xs">
                  {product.brand}
                </span>
                <p className="text-lg font-bold text-black truncate block capitalize">
                  {product.name}
                </p>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    ${product.price}
                  </p>
                  {product.discountPrice && (
                    <del>
                      <p className="text-sm text-gray-600 cursor-auto ml-2">
                        ${product.discountPrice}
                      </p>
                    </del>
                  )}
                  <div className="ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-bag-plus"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                      />
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </section>
    </div>
  )
}
