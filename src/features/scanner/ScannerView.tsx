import { useEffect, useRef } from 'react';
import { useScanner } from './useScanner';
import Viewfinder from './Viewfinder';
import ResultCard from './ResultCard';
import { Camera, CameraOff } from 'lucide-react';

const SCANNER_ELEMENT_ID = 'scanner-region';

const ScannerView = () => {
  const {
    isScanning,
    result,
    showResult,
    isDuplicate,
    permissionDenied,
    startScanning,
    stopScanning,
    dismissResult,
  } = useScanner();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      startScanning(SCANNER_ELEMENT_ID);
    }
    return () => {
      stopScanning();
      mountedRef.current = false;
    };
  }, []);

  return (
    <div className="relative flex-1 flex flex-col bg-background overflow-hidden">
      {/* Camera feed */}
      <div className="relative flex-1">
        <div
          id={SCANNER_ELEMENT_ID}
          className="absolute inset-0 [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
        />

        {isScanning && <Viewfinder />}

        {/* Permission denied state */}
        {permissionDenied && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 z-20 p-8">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <CameraOff className="w-8 h-8 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Camera Access Required</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                Please allow camera access in your browser settings to scan barcodes.
              </p>
            </div>
          </div>
        )}

        {/* Not scanning idle state */}
        {!isScanning && !permissionDenied && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 z-20">
            <button
              onClick={() => startScanning(SCANNER_ELEMENT_ID)}
              className="w-20 h-20 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-primary/25"
            >
              <Camera className="w-8 h-8 text-primary-foreground" />
            </button>
            <p className="text-sm text-muted-foreground">Tap to start scanning</p>
          </div>
        )}
      </div>

      {/* Result card */}
      {result && (
        <ResultCard
          result={result}
          visible={showResult}
          isDuplicate={isDuplicate}
          onDismiss={dismissResult}
        />
      )}
    </div>
  );
};

export default ScannerView;
