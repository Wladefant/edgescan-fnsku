import { useState } from 'react';
import { BottomNav, AppView } from '@/components/BottomNav';
import { ScannerPage } from './ScannerPage';
import { InventoryListPage } from './InventoryListPage';
import { AnalyticsPage } from './AnalyticsPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const [activeView, setActiveView] = useState<AppView>('scanner');
  const renderActiveView = () => {
    switch (activeView) {
      case 'scanner':
        return <ScannerPage />;
      case 'inventory':
        return <InventoryListPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <ScannerPage />;
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle className="absolute top-4 right-4 z-50" />
      <main>
        {renderActiveView()}
      </main>
      {activeView !== 'scanner' && <BottomNav activeView={activeView} setActiveView={setActiveView} />}
      {activeView === 'scanner' && <div className="fixed bottom-0 left-0 right-0 h-16 bg-amazon-blue"><BottomNav activeView={activeView} setActiveView={setActiveView} /></div>}
      <Toaster richColors position="top-center" />
    </div>
  );
}