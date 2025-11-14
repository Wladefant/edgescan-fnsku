import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import type { AppView } from '@/components/BottomNav';
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
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      <Toaster richColors position="top-center" />
    </div>
  );
}