
import React from 'react';
import { Product } from '../types';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (id: string, newStock: number) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, onUpdateStock }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">Inventory Management</h2>
          <p className="text-slate-500">Monitor and update your store stock levels</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Cost Price</th>
                <th className="px-6 py-4 text-center">Selling Price</th>
                <th className="px-6 py-4 text-center">Current Stock</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{product.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">ID: {product.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600 font-medium">₹{product.costPrice}</td>
                  <td className="px-6 py-4 text-center text-slate-900 font-bold">₹{product.sellingPrice}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 5))}
                        className="px-2 py-1 hover:bg-slate-200 rounded text-slate-600 text-xs font-bold transition-colors border border-slate-200 bg-white"
                      >
                        -5
                      </button>
                      <button 
                        onClick={() => onUpdateStock(product.id, product.stock + 5)}
                        className="px-2 py-1 hover:bg-slate-200 rounded text-slate-600 text-xs font-bold transition-colors border border-slate-200 bg-white"
                      >
                        +5
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
