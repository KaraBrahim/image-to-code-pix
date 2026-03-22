import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/db';
import { Upload, FileSpreadsheet, Trash2, CheckCircle2, AlertCircle, Database, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CsvUpload = () => {
  const { importProducts, clearAll, productCount, lastUpdated, isLoading } = useStore();
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const processFile = useCallback(async (file: File) => {
    setUploadStatus('idle');
    setErrorMsg('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as Record<string, string>[];

        const headers = Object.keys(data[0] || {});
        const barcodeCol = headers.find(h =>
          /barcode|code|sku|ean|upc|gtin/i.test(h)
        );

        if (!barcodeCol) {
          setErrorMsg('No barcode column found. Expected: barcode, code, sku, ean, upc, or gtin.');
          setUploadStatus('error');
          return;
        }

        const nameCol = headers.find(h => /name|title|product|item|description/i.test(h) && !/price/i.test(h));
        const priceCol = headers.find(h => /price|cost|amount/i.test(h));
        const descCol = headers.find(h => /desc|detail|info/i.test(h) && h !== nameCol);
        const catCol = headers.find(h => /cat|category|type|group/i.test(h));

        const products: Product[] = data
          .filter(row => row[barcodeCol]?.trim())
          .map(row => ({
            barcode: row[barcodeCol].trim(),
            name: nameCol ? row[nameCol]?.trim() || 'Unknown' : 'Unknown',
            price: priceCol ? row[priceCol]?.trim() : undefined,
            description: descCol ? row[descCol]?.trim() : undefined,
            category: catCol ? row[catCol]?.trim() : undefined,
          }));

        if (products.length === 0) {
          setErrorMsg('No valid products found in the CSV.');
          setUploadStatus('error');
          return;
        }

        await importProducts(products);
        setImportedCount(products.length);
        setUploadStatus('success');
      },
      error: () => {
        setErrorMsg('Failed to parse CSV file.');
        setUploadStatus('error');
      },
    });
  }, [importProducts]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  }, [processFile]);

  return (
    <div className="flex-1 flex flex-col bg-background px-4 py-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Data Import</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload a CSV to power your barcode lookups.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-subtle rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Products</span>
            </div>
            <p className="text-xl font-bold text-foreground tabular-nums">{productCount.toLocaleString()}</p>
          </div>
          <div className="glass-subtle rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Synced</span>
            </div>
            <p className="text-xs font-semibold text-foreground">
              {lastUpdated ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true }) : 'Never'}
            </p>
          </div>
        </div>

        {/* Upload zone */}
        <label
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 active:scale-[0.98] ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/30'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              dragOver ? 'bg-primary/20' : 'bg-muted'
            }`}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className={`w-5 h-5 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isLoading ? 'Importing...' : 'Drop CSV here or tap to browse'}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Requires a barcode/sku column
              </p>
            </div>
          </div>
        </label>

        {/* Status messages */}
        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-success/10 border border-success/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <p className="text-xs text-foreground">
              Imported <span className="font-semibold tabular-nums">{importedCount.toLocaleString()}</span> products.
            </p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-xs text-foreground">{errorMsg}</p>
          </div>
        )}

        {/* CSV format hint */}
        <div className="glass-subtle rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Expected Format</span>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground leading-relaxed bg-background/50 rounded-lg p-2.5 overflow-x-auto">
            barcode,name,price,category<br />
            8901234567890,Widget Pro,$12.99,Electronics<br />
            7654321098765,Gadget Mini,$7.50,Accessories
          </div>
        </div>

        {/* Clear data */}
        {productCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors active:scale-[0.98]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all data
          </button>
        )}
      </div>
    </div>
  );
};

export default CsvUpload;
