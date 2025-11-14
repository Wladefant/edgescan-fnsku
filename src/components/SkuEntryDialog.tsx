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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ScannedItem } from '@shared/types';
export function SkuEntryDialog() {
  const queryClient = useQueryClient();
  const activeFNSKU = useStore((state) => state.activeFNSKU);
  const isDialogOpen = useStore((state) => state.isDialogOpen);
  const setDialogOpen = useStore((state) => state.setDialogOpen);
  const setActiveFNSKU = useStore((state) => state.setActiveFNSKU);
  const [sku, setSku] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const createItemMutation = useMutation({
    mutationFn: (newItem: { fnsku: string; sku: string }) => 
      api<ScannedItem>('/api/items', {
        method: 'POST',
        body: JSON.stringify(newItem),
      }),
    onSuccess: (data) => {
      toast.success(`FNSKU ${data.fnsku} assigned to SKU ${data.sku}`);
      queryClient.invalidateQueries({ queryKey: ['scannedItems'] });
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to save SKU: ${error.message}`);
    },
  });
  useEffect(() => {
    if (isDialogOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isDialogOpen]);
  const handleSubmit = () => {
    if (!activeFNSKU || !sku.trim()) {
      toast.error('SKU cannot be empty.');
      return;
    }
    createItemMutation.mutate({ fnsku: activeFNSKU, sku: sku.trim() });
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
              disabled={createItemMutation.isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-amazon-orange text-amazon-blue hover:bg-opacity-90 focus:ring-amazon-orange"
            disabled={createItemMutation.isPending}
          >
            {createItemMutation.isPending ? 'Saving...' : 'Save SKU'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}