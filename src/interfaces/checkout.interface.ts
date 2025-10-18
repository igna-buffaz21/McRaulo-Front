export interface Checkout {
    id_cart: string;
    orderType: string | null;     
    paymentMethod: string | null;   
    currentStep: number;
  }
  