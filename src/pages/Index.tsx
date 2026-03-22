import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import TopBar from '@/features/shell/TopBar';
import BottomNav from '@/features/shell/BottomNav';
import ScannerView from '@/features/scanner/ScannerView';
import CsvUpload from '@/features/config/CsvUpload';

type Tab = 'scan' | 'config';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const loadProducts = useStore(s => s.loadProducts);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      <TopBar title="ScanFlow" />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === 'scan' && <ScannerView />}
        {activeTab === 'config' && <CsvUpload />}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
