import { ScanLine, Settings } from 'lucide-react';

type Tab = 'scan' | 'config';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs: { id: Tab; icon: typeof ScanLine; label: string }[] = [
    { id: 'scan', icon: ScanLine, label: 'Scanner' },
    { id: 'config', icon: Settings, label: 'Data' },
  ];

  return (
    <div className="glass sticky bottom-0 z-40 px-6 py-2 flex items-center justify-around">
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors active:scale-95 ${
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
