import { useStore } from '@/lib/store';
import { Wifi, WifiOff } from 'lucide-react';

const TopBar = ({ title }: { title: string }) => {
  const isOnline = useStore(s => s.isOnline);
  const productCount = useStore(s => s.productCount);

  return (
    <div className="glass sticky top-0 z-40 px-5 py-3 flex items-center justify-between">
      <h1 className="text-base font-bold text-foreground tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground tabular-nums font-medium">
          {productCount.toLocaleString()} items
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-destructive'} animate-pulse-dot`} />
          {isOnline ? (
            <WifiOff className="w-3.5 h-3.5 text-muted-foreground hidden" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
