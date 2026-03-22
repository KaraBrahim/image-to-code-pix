import { X, PackageCheck, PackageX } from 'lucide-react';
import { Product } from '@/lib/db';

interface ResultCardProps {
  result: {
    product: Product | null;
    barcode: string;
    found: boolean;
  };
  visible: boolean;
  isDuplicate: boolean;
  onDismiss: () => void;
}

const ResultCard = ({ result, visible, isDuplicate, onDismiss }: ResultCardProps) => {
  if (!visible) return null;

  const found = result.found;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 px-4 pb-8 pt-2 ${isDuplicate ? 'animate-shake' : 'animate-slide-up'}`}
    >
      <div className={`glass rounded-2xl p-5 mx-auto max-w-md border ${found ? 'border-success/30' : 'border-destructive/30'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${found ? 'bg-success/20' : 'bg-destructive/20'}`}>
              {found ? (
                <PackageCheck className="w-5 h-5 text-success" />
              ) : (
                <PackageX className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                {found ? 'Product Found' : 'Not Found'}
              </p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-0.5">{result.barcode}</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors active:scale-95"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Product details */}
        {found && result.product && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {result.product.name}
            </h3>
            {result.product.price && (
              <p className="text-2xl font-bold text-primary">{result.product.price}</p>
            )}
            {result.product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{result.product.description}</p>
            )}
            {result.product.category && (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {result.product.category}
              </span>
            )}
          </div>
        )}

        {!found && (
          <p className="text-sm text-muted-foreground">
            This barcode is not in your product database. Import a CSV with this barcode to see details.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
