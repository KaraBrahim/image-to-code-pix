import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/db';

interface ScanResult {
  product: Product | null;
  barcode: string;
  found: boolean;
}

export function useScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<{ barcode: string; time: number } | null>(null);
  const lookupBarcode = useStore(s => s.lookupBarcode);

  const handleScan = useCallback((decodedText: string) => {
    const now = Date.now();
    const last = lastScannedRef.current;

    // Debounce: same barcode within 1.5s
    if (last && last.barcode === decodedText && now - last.time < 1500) {
      setIsDuplicate(true);
      setTimeout(() => setIsDuplicate(false), 500);
      return;
    }

    lastScannedRef.current = { barcode: decodedText, time: now };
    const product = lookupBarcode(decodedText);
    setResult({
      product: product ?? null,
      barcode: decodedText,
      found: !!product,
    });
    setShowResult(true);
  }, [lookupBarcode]);

  const startScanning = useCallback(async (elementId: string) => {
    if (scannerRef.current) return;
    try {
      const scanner = new Html5Qrcode(elementId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 280, height: 280 } },
        handleScan,
        () => {}
      );
      setIsScanning(true);
      setPermissionDenied(false);
    } catch (err: any) {
      if (err?.toString().includes('Permission')) {
        setPermissionDenied(true);
      }
      console.error('Scanner error:', err);
    }
  }, [handleScan]);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
      setIsScanning(false);
    }
  }, []);

  const dismissResult = useCallback(() => {
    setShowResult(false);
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return {
    isScanning,
    result,
    showResult,
    isDuplicate,
    permissionDenied,
    startScanning,
    stopScanning,
    dismissResult,
  };
}
