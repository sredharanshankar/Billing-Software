
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SaleRecord, DashboardStats } from '../types';

interface DashboardViewProps {
  sales: SaleRecord[];
  stats: DashboardStats;
  onRefund: (saleId: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ sales, stats, onRefund }) => {
  // Chart data: daily grouping (simplified for this demo mock)
  const chartData = sales.slice(-10).map((s, i) => ({
    name: `Sale ${i + 1}`,
    amount: s.finalAmount,
    profit: s.profit
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800">Business Dashboard</h2>
        <p className="text-slate-500">Real-time performance and financial tracking</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: `₹${stats.totalSales}`, color: 'blue' },
          { label: 'Total Profit', value: `₹${stats.totalProfit}`, color: 'green' },
          { label: 'GST Collected', value: `₹${stats.totalTax}`, color: 'orange' },
          { label: 'Bills Generated', value: stats.totalBills.toString(), color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-2xl font-black mt-2 text-${stat.color}-600`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-6">Recent Transaction Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#3b82f6" barSize={30} />
                <Bar dataKey="profit" radius={[4, 4, 0, 0]} fill="#10b981" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-xs font-bold">Sales</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-xs font-bold">Profit</span></div>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4">Live History</h3>
          <div className="flex-1 overflow-y-auto space-y-3">
            {sales.length === 0 ? (
              <p className="text-center text-slate-400 text-sm mt-10">No sales recorded today</p>
            ) : (
              sales.map((sale) => (
                <div key={sale.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-sm text-slate-700">₹{sale.finalAmount}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {sale.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sale.paymentMethod}
                    </p>
                  </div>
                  <button 
                    onClick={() => onRefund(sale.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold"
                  >
                    Refund
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
