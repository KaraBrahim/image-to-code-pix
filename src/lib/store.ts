import { create } from 'zustand';
import { Product, getAllProducts, saveProducts, clearProducts, getLastUpdated, getProductCount } from './db';

interface ScanFlowState {
  productMap: Map<string, Product>;
  productCount: number;
  lastUpdated: string | null;
  isOnline: boolean;
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  importProducts: (products: Product[]) => Promise<void>;
  lookupBarcode: (barcode: string) => Product | undefined;
  clearAll: () => Promise<void>;
}

export const useStore = create<ScanFlowState>((set, get) => ({
  productMap: new Map(),
  productCount: 0,
  lastUpdated: null,
  isOnline: navigator.onLine,
  isLoading: false,

  loadProducts: async () => {
    set({ isLoading: true });
    const products = await getAllProducts();
    const map = new Map<string, Product>();
    products.forEach(p => map.set(p.barcode, p));
    const lastUpdated = await getLastUpdated();
    const count = await getProductCount();
    set({ productMap: map, lastUpdated, productCount: count, isLoading: false });
  },

  importProducts: async (products: Product[]) => {
    set({ isLoading: true });
    await saveProducts(products);
    const map = new Map<string, Product>(get().productMap);
    products.forEach(p => map.set(p.barcode, p));
    const lastUpdated = await getLastUpdated();
    const count = await getProductCount();
    set({ productMap: map, lastUpdated, productCount: count, isLoading: false });
  },

  lookupBarcode: (barcode: string) => {
    return get().productMap.get(barcode);
  },

  clearAll: async () => {
    await clearProducts();
    set({ productMap: new Map(), productCount: 0, lastUpdated: null });
  },
}));

// Listen for online/offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => useStore.setState({ isOnline: true }));
  window.addEventListener('offline', () => useStore.setState({ isOnline: false }));
}
