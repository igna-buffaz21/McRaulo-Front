import type { Cart, CartItem } from "@/interfaces/carrito.interface";
import { v4 as uuid } from "uuid";

const CART_KEY = "cart";

function emptyCart(): Cart { //reinicia el carrito
  return {
    id_cart: crypto.randomUUID?.() || "cart_" + Date.now(),
    items: [],
    totales: {
      items: 0,
      subtotal: 0,
      discount: 0,
    },
  };
}

export function loadCart(): Cart { //inicializa el carrito o te devuelve el carrito guardado
  const raw = localStorage.getItem(CART_KEY);
  return raw ? (JSON.parse(raw) as Cart) : emptyCart();
}

function recalc(cart: Cart): Cart { //cada vez que se agrega un item o se modifica, recalcula totales
  const subtotal = cart.items.reduce((acc, it) => acc + it.precio_base, 0);
  return {
    ...cart,
    totales: {
      ...cart.totales,
      items: cart.items.length,
      subtotal,
    },
  };
}

function saveCart(cart: Cart) { //guarda el carrito en localstorage
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function removeItem(id: string): Cart { //elimina un item del carrito
  const cart = loadCart(); //trae carrito
  const filtered = cart.items.filter((it) => it.id !== id); //filter hace una copia del array sin el item que queremos eliminar
  const updated = recalc({ ...cart, items: filtered }); //recalcula totales
  saveCart(updated); //guarda carrito
  console.log("CARRITO ACTUALIZADO: ", updated);
  return updated;
}

export function agregarCarrito(item: CartItem): Cart { //agrega un item al carrito
  const cart = loadCart();
  item.id = uuid()
  cart.items.push(item);
  const updated = recalc(cart);
  saveCart(updated);
  console.log("CARRITO ACTUALIZADO: ", updated);
  return updated;
}

export function modificarItem(id: string, cambios: Partial<CartItem>): Cart {
  const cart = loadCart();

  // Buscar y modificar el item correspondiente
  const itemsActualizados = cart.items.map((item) =>
    item.id === id ? { ...item, ...cambios } : item
  );

  const actualizado = recalc({ ...cart, items: itemsActualizados });
  saveCart(actualizado);

  console.log("CARRITO MODIFICADO:", actualizado);
  return actualizado;
}

