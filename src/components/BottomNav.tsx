import { Barcode, List, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
export type AppView = 'scanner' | 'inventory' | 'analytics';
interface BottomNavProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}
const navItems: { view: AppView; icon: React.ElementType; label: string }[] = [
  { view: 'scanner', icon: Barcode, label: 'Scanner' },
  { view: 'inventory', icon: List, label: 'Inventory' },
  { view: 'analytics', icon: PieChart, label: 'Analytics' },
];
export function BottomNav({ activeView, setActiveView }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-amazon-blue text-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-full max-w-7xl mx-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ease-in-out',
              activeView === item.view ? 'text-amazon-orange' : 'text-gray-300 hover:text-white'
            )}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}