
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'pos' | 'inventory' | 'dashboard';
  setActiveTab: (tab: 'pos' | 'inventory' | 'dashboard') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-400">SmartPOS</h1>
          <p className="text-xs text-slate-400 mt-1">Store Management Pro</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <button
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'pos' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Icons.Cart />
            <span className="font-medium">Billing (POS)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Icons.Inventory />
            <span className="font-medium">Inventory</span>
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Icons.Dashboard />
            <span className="font-medium">Dashboard</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">System Status</p>
            <div className="flex items-center mt-2 text-green-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Live Sync Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around bg-slate-900 text-white p-4 fixed bottom-0 left-0 right-0 z-50">
          <button onClick={() => setActiveTab('pos')} className={activeTab === 'pos' ? 'text-blue-400' : ''}><Icons.Cart /></button>
          <button onClick={() => setActiveTab('inventory')} className={activeTab === 'inventory' ? 'text-blue-400' : ''}><Icons.Inventory /></button>
          <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'text-blue-400' : ''}><Icons.Dashboard /></button>
        </div>
        
        <div className="max-w-7xl mx-auto pb-20 md:pb-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
