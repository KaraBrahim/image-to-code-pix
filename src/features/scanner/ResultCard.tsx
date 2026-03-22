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
      className={`absolute bottom-2 inset-x-2 z-50 ${isDuplicate ? 'animate-shake' : 'animate-slide-up'}`}
    >
      <div className={`glass rounded-2xl p-4 border ${found ? 'border-success/30' : 'border-destructive/30'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${found ? 'bg-success/20' : 'bg-destructive/20'}`}>
              {found ? (
                <PackageCheck className="w-4.5 h-4.5 text-success" />
              ) : (
                <PackageX className="w-4.5 h-4.5 text-destructive" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                {found ? 'Product Found' : 'Not Found'}
              </p>
              <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5 truncate">{result.barcode}</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors active:scale-95 shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Product details */}
        {found && result.product && (
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-foreground leading-tight">
              {result.product.name}
            </h3>
            {result.product.price && (
              <p className="text-xl font-bold text-primary">{result.product.price}</p>
            )}
            {result.product.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{result.product.description}</p>
            )}
            {result.product.category && (
              <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {result.product.category}
              </span>
            )}
          </div>
        )}

        {!found && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            This barcode is not in your product database.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
