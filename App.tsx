
import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import POSView from './components/POSView';
import InventoryView from './components/InventoryView';
import DashboardView from './components/DashboardView';
import { Product, CartItem, Discount, PaymentMethod, SaleRecord, DashboardStats } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'dashboard'>('pos');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  // Derived Stats
  const stats: DashboardStats = sales.reduce((acc, s) => ({
    totalBills: acc.totalBills + 1,
    totalSales: acc.totalSales + s.finalAmount,
    totalTax: acc.totalTax + s.taxAmount,
    totalProfit: acc.totalProfit + s.profit
  }), { totalBills: 0, totalSales: 0, totalTax: 0, totalProfit: 0 });

  const completeSale = useCallback((items: CartItem[], discount: Discount, paymentMethod: PaymentMethod, cashGiven: number) => {
    // 1. Calculate SubTotal
    const subTotal = items.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
    
    // 2. Calculate Discount
    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (discount.value / 100) * subTotal;
    } else {
      discountAmount = discount.value;
    }

    // 3. Tax Calculation
    const taxAmount = items.reduce((acc, item) => {
      const itemRatio = subTotal > 0 ? (item.product.sellingPrice * item.quantity) / subTotal : 0;
      const itemTaxable = Math.max(0, (item.product.sellingPrice * item.quantity) - (discountAmount * itemRatio));
      return acc + (itemTaxable * (item.product.gstPercent / 100));
    }, 0);

    const finalAmount = Math.round(subTotal - discountAmount + taxAmount);

    // 4. Profit Calculation
    const totalCost = items.reduce((acc, item) => acc + (item.product.costPrice * item.quantity), 0);
    // Profit = (Amount received from customer excluding tax) - Cost
    const netSale = Math.max(0, subTotal - discountAmount);
    const profit = netSale - totalCost;

    // 5. Update Stock
    setProducts(prev => prev.map(p => {
      const soldItem = items.find(item => item.product.id === p.id);
      if (soldItem) {
        return { ...p, stock: p.stock - soldItem.quantity };
      }
      return p;
    }));

    // 6. Record Sale
    const newSale: SaleRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      items,
      subTotal,
      discountAmount,
      taxAmount,
      finalAmount,
      paymentMethod,
      profit
    };

    setSales(prev => [newSale, ...prev]);
  }, []);

  const handleRefund = (saleId: string) => {
    const saleToRefund = sales.find(s => s.id === saleId);
    if (!saleToRefund) return;

    // Restore stock
    setProducts(prev => prev.map(p => {
      const returnedItem = saleToRefund.items.find(item => item.product.id === p.id);
      if (returnedItem) {
        return { ...p, stock: p.stock + returnedItem.quantity };
      }
      return p;
    }));

    // Remove sale
    setSales(prev => prev.filter(s => s.id !== saleId));
  };

  const updateStockManually = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'pos' && (
        <POSView products={products} onCompleteSale={completeSale} />
      )}
      {activeTab === 'inventory' && (
        <InventoryView products={products} onUpdateStock={updateStockManually} />
      )}
      {activeTab === 'dashboard' && (
        <DashboardView sales={sales} stats={stats} onRefund={handleRefund} />
      )}
    </Layout>
  );
};

export default App;
