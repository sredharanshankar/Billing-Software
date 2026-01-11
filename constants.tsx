
import React from 'react';
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Rice', category: 'Grains', costPrice: 40, sellingPrice: 50, stock: 100, gstPercent: 5, image: 'https://picsum.photos/seed/rice/200' },
  { id: '2', name: 'Fresh Milk 1L', category: 'Dairy', costPrice: 50, sellingPrice: 60, stock: 50, gstPercent: 0, image: 'https://picsum.photos/seed/milk/200' },
  { id: '3', name: 'Artisan Soap', category: 'Hygiene', costPrice: 25, sellingPrice: 40, stock: 200, gstPercent: 12, image: 'https://picsum.photos/seed/soap/200' },
  { id: '4', name: 'Cooking Oil', category: 'Essentials', costPrice: 140, sellingPrice: 180, stock: 30, gstPercent: 5, image: 'https://picsum.photos/seed/oil/200' },
  { id: '5', name: 'Organic Tea', category: 'Beverage', costPrice: 80, sellingPrice: 120, stock: 75, gstPercent: 18, image: 'https://picsum.photos/seed/tea/200' },
  { id: '6', name: 'Refined Sugar', category: 'Essentials', costPrice: 35, sellingPrice: 45, stock: 120, gstPercent: 5, image: 'https://picsum.photos/seed/sugar/200' },
];

export const Icons = {
  Cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  ),
  Inventory: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  )
};
