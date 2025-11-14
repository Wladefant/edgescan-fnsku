import { create } from 'zustand';
import { ScannedItem } from '@shared/types';
import { formatISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
// Mock data for initial development
const MOCK_SCANNED_ITEMS: ScannedItem[] = [
  { id: uuidv4(), fnsku: 'X0024JOP88', sku: 'LOCAL-SKU-001', scannedAt: formatISO(new Date()) },
  { id: uuidv4(), fnsku: 'X0039Z527R', sku: 'LOCAL-SKU-002', scannedAt: formatISO(new Date()) },
  { id: uuidv4(), fnsku: 'X001D18K2D', sku: 'LOCAL-SKU-003', scannedAt: formatISO(new Date()) },
];
interface AppState {
  scannedItems: ScannedItem[];
  activeFNSKU: string | null;
  isDialogOpen: boolean;
  addItem: (item: { fnsku: string; sku: string }) => void;
  setActiveFNSKU: (fnsku: string | null) => void;
  setDialogOpen: (isOpen: boolean) => void;
  clearItems: () => void;
}
export const useStore = create<AppState>((set) => ({
  scannedItems: MOCK_SCANNED_ITEMS,
  activeFNSKU: null,
  isDialogOpen: false,
  addItem: ({ fnsku, sku }) =>
    set((state) => ({
      scannedItems: [
        { id: uuidv4(), fnsku, sku, scannedAt: formatISO(new Date()) },
        ...state.scannedItems,
      ],
    })),
  setActiveFNSKU: (fnsku) => set({ activeFNSKU: fnsku }),
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
  clearItems: () => set({ scannedItems: [] }),
}));