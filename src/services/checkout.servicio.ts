import type { Checkout, OrderType, PaymentMethod } from "@/interfaces/checkout.interface";

const CHECKOUT_KEY = "checkout";

/**
 * Inicializa un checkout vacío (sin tipo de pedido ni método de pago)
 */
export function emptyCheckout(id_cart: string): Checkout {
  return {
    id_cart,
    orderType: null,
    paymentMethod: null,
    currentStep: 1, // comienza siempre en el paso 1
  };
}

/**
 * Carga el checkout desde localStorage o lo crea vacío si no existe
 */
export function loadCheckout(id_cart: string): Checkout {
  const raw = localStorage.getItem(CHECKOUT_KEY);

  if (raw) {
    const checkout = JSON.parse(raw) as Checkout;

    // Si el carrito cambió (nuevo pedido), reinicia el flujo
    if (checkout.id_cart !== id_cart) {
      return emptyCheckout(id_cart);
    }

    return checkout;
  }

  return emptyCheckout(id_cart);
}

/**
 * Guarda el estado actual del checkout en localStorage
 */
export function saveCheckout(checkout: Checkout): void {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout));
}

export function updateOrderType(id_cart: string, orderType: string): Checkout {
  const checkout = loadCheckout(id_cart);
  const updated: Checkout = {
    ...checkout,
    orderType,
    currentStep: 2,
  };
  saveCheckout(updated);
  return updated;
}

export function updatePaymentMethod(id_cart: string, paymentMethod: string): Checkout {
  const checkout = loadCheckout(id_cart);
  const updated: Checkout = {
    ...checkout,
    paymentMethod,
    currentStep: 3,
  };
  saveCheckout(updated);
  return updated;
}


/**
 * Retrocede un paso en el flujo de pago
 */
export function goBackStep(id_cart: string): Checkout {
  const checkout = loadCheckout(id_cart);

  const updated: Checkout = {
    ...checkout,
    currentStep: Math.max(1, checkout.currentStep - 1), // no baja de 1
  };

  saveCheckout(updated);
  return updated;
}

/**
 * Limpia completamente el flujo de checkout (por ejemplo, al confirmar pedido)
 */
export function clearCheckout(): void {
  localStorage.removeItem(CHECKOUT_KEY);
}
