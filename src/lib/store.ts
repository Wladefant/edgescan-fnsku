import { create } from 'zustand';
interface AppState {
  activeFNSKU: string | null;
  isDialogOpen: boolean;
  setActiveFNSKU: (fnsku: string | null) => void;
  setDialogOpen: (isOpen: boolean) => void;
}
export const useStore = create<AppState>((set) => ({
  activeFNSKU: null,
  isDialogOpen: false,
  setActiveFNSKU: (fnsku) => set({ activeFNSKU: fnsku }),
  setDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),
}));