
export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  gstPercent: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Discount {
  type: 'PERCENTAGE' | 'FLAT';
  value: number;
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD'
}

export interface SaleRecord {
  id: string;
  timestamp: Date;
  items: CartItem[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  profit: number;
}

export interface DashboardStats {
  totalBills: number;
  totalSales: number;
  totalTax: number;
  totalProfit: number;
}
