
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Discount, PaymentMethod } from '../types';
import { Icons } from '../constants';

interface POSViewProps {
  products: Product[];
  onCompleteSale: (items: CartItem[], discount: Discount, paymentMethod: PaymentMethod, cashGiven: number) => void;
}

const POSView: React.FC<POSViewProps> = ({ products, onCompleteSale }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState<Discount>({ type: 'FLAT', value: 0 });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  // Calculations
  const totals = useMemo(() => {
    const subTotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
    
    let discountAmount = 0;
    if (discount.type === 'PERCENTAGE') {
      discountAmount = (discount.value / 100) * subTotal;
    } else {
      discountAmount = discount.value;
    }

    const amountAfterDiscount = Math.max(0, subTotal - discountAmount);
    
    // Calculate GST based on items
    const taxAmount = cart.reduce((acc, item) => {
      const itemSubTotal = item.product.sellingPrice * item.quantity;
      const itemRatio = subTotal > 0 ? itemSubTotal / subTotal : 0;
      const itemDiscount = discountAmount * itemRatio;
      const itemTaxable = Math.max(0, itemSubTotal - itemDiscount);
      return acc + (itemTaxable * (item.product.gstPercent / 100));
    }, 0);

    const finalRaw = amountAfterDiscount + taxAmount;
    const finalAmount = Math.round(finalRaw);

    return {
      subTotal,
      discountAmount,
      taxAmount,
      finalAmount,
      balance: Math.max(0, cashGiven - finalAmount)
    };
  }, [cart, discount, cashGiven]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    onCompleteSale(cart, discount, paymentMethod, cashGiven);
    setCart([]);
    setDiscount({ type: 'FLAT', value: 0 });
    setCashGiven(0);
    setPaymentMethod(PaymentMethod.CASH);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <input
            type="text"
            placeholder="Search items by name or category..."
            className="w-full px-4 py-3 rounded-lg bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`group relative bg-white p-5 rounded-xl shadow-sm border border-slate-200 transition-all hover:border-blue-500 hover:shadow-md text-left flex flex-col justify-between min-h-[120px] ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{product.category}</span>
                <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight mb-2">{product.name}</h3>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-blue-600 font-black text-lg">₹{product.sellingPrice}</p>
                  <p className={`text-[10px] font-bold ${product.stock < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                    Stock: {product.stock}
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] sticky top-4">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Icons.Cart /> Current Order
            </h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
              {cart.length} Items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
                <Icons.Cart />
                <p className="text-sm">Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex gap-3 items-center group">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-slate-500">₹{item.product.sellingPrice} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-blue-600 text-sm font-bold">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:text-blue-600 text-sm font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <Icons.Trash />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 rounded-b-xl">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Sub-total</span>
              <span>₹{totals.subTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <select 
                className="text-xs border rounded px-1 py-1 bg-white outline-none"
                value={discount.type}
                onChange={(e) => setDiscount(d => ({ ...d, type: e.target.value as any }))}
              >
                <option value="FLAT">Flat ₹ Off</option>
                <option value="PERCENTAGE">% Off</option>
              </select>
              <input 
                type="number"
                className="w-20 text-right text-sm border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                value={discount.value}
                onChange={(e) => setDiscount(d => ({ ...d, value: Number(e.target.value) }))}
                min="0"
              />
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Total Tax (GST)</span>
              <span>₹{totals.taxAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-center">
              <span className="font-bold text-lg">Payable</span>
              <span className="font-extrabold text-2xl text-blue-600">₹{totals.finalAmount}</span>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Payment Details</p>
              <div className="flex gap-2">
                {[PaymentMethod.CASH, PaymentMethod.UPI, PaymentMethod.CARD].map(m => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${paymentMethod === m ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              
              {paymentMethod === PaymentMethod.CASH && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-xs text-slate-500">Cash Received:</span>
                    <input 
                      type="number"
                      className="w-full text-right text-sm border rounded px-2 py-2 outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(Number(e.target.value))}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold bg-green-50 text-green-700 p-2 rounded-lg border border-green-100">
                    <span>Change to Return:</span>
                    <span>₹{totals.balance}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || (paymentMethod === PaymentMethod.CASH && cashGiven < totals.finalAmount)}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${cart.length === 0 ? 'bg-slate-300 cursor-not-allowed text-slate-500' : 'bg-green-600 hover:bg-green-700 text-white active:scale-95'}`}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
