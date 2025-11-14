import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
export function SkuEntryDialog() {
  const activeFNSKU = useStore((state) => state.activeFNSKU);
  const isDialogOpen = useStore((state) => state.isDialogOpen);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const addItem = useStore((state) => state.addItem);
  const setActiveFNSKU = useStore((state) => state.setActiveFNSKU);
  const [sku, setSku] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isDialogOpen) {
      // Autofocus input when dialog opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isDialogOpen]);
  const handleSubmit = () => {
    if (!activeFNSKU || !sku.trim()) {
      toast.error('SKU cannot be empty.');
      return;
    }
    addItem({ fnsku: activeFNSKU, sku: sku.trim() });
    toast.success(`FNSKU ${activeFNSKU} assigned to SKU ${sku.trim()}`);
    handleClose();
  };
  const handleClose = () => {
    setSku('');
    setDialogOpen(false);
    setActiveFNSKU(null);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white" onEscapeKeyDown={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-amazon-blue">Assign Local SKU</DialogTitle>
          <DialogDescription>
            Enter the warehouse SKU for the scanned FNSKU.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fnsku" className="text-right">
              FNSKU
            </Label>
            <Input id="fnsku" value={activeFNSKU || ''} readOnly className="col-span-3 bg-gray-100" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              Local SKU
            </Label>
            <Input
              id="sku"
              ref={inputRef}
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="col-span-3 focus:ring-amazon-orange"
              placeholder="e.g., A1-B2-C3"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-amazon-orange text-amazon-blue hover:bg-opacity-90 focus:ring-amazon-orange"
          >
            Save SKU
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}