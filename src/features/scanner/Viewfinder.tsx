const Viewfinder = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="relative w-[280px] h-[280px]">
        {/* Semi-transparent overlay outside viewfinder */}
        {/* Corner indicators */}
        {[
          'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
          'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
          'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
          'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-10 h-10 border-primary ${cls}`}
            style={{ animation: 'corner-pulse 2s ease-in-out infinite' }}
          />
        ))}
        {/* Scan line */}
        <div className="absolute inset-x-4 top-2 bottom-2 overflow-hidden">
          <div
            className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line"
          />
        </div>
      </div>
    </div>
  );
};

export default Viewfinder;
