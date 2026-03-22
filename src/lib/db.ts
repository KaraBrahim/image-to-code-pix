import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Product {
  barcode: string;
  name: string;
  price?: string;
  description?: string;
  category?: string;
  [key: string]: string | undefined;
}

interface ScanFlowDB extends DBSchema {
  products: {
    key: string;
    value: Product;
  };
  meta: {
    key: string;
    value: { key: string; value: string };
  };
}

let dbInstance: IDBPDatabase<ScanFlowDB> | null = null;

async function getDB(): Promise<IDBPDatabase<ScanFlowDB>> {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB<ScanFlowDB>('scanflow', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'barcode' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    },
  });
  return dbInstance;
}

export async function saveProducts(products: Product[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('products', 'readwrite');
  await Promise.all([
    ...products.map(p => tx.store.put(p)),
    tx.done,
  ]);
  const metaTx = db.transaction('meta', 'readwrite');
  await metaTx.store.put({ key: 'lastUpdated', value: new Date().toISOString() });
  await metaTx.done;
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDB();
  return db.getAll('products');
}

export async function getProductCount(): Promise<number> {
  const db = await getDB();
  return db.count('products');
}

export async function getLastUpdated(): Promise<string | null> {
  const db = await getDB();
  const meta = await db.get('meta', 'lastUpdated');
  return meta?.value ?? null;
}

export async function clearProducts(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('products', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

export type { Product };
