import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ScannedItem } from '@shared/types';
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function InventoryListPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: scannedItems = [], isLoading, error } = useQuery<ScannedItem[]>({
    queryKey: ['scannedItems'],
    queryFn: () => api('/api/items'),
  });
  const clearAllMutation = useMutation({
    mutationFn: () => api('/api/items/delete-all', { method: 'POST' }),
    onSuccess: () => {
      toast.success('All items have been cleared.');
      queryClient.invalidateQueries({ queryKey: ['scannedItems'] });
    },
    onError: (err) => {
      toast.error(`Failed to clear items: ${err.message}`);
    },
  });
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all scanned items? This action cannot be undone.')) {
      clearAllMutation.mutate();
    }
  };
  const filteredItems = scannedItems.filter(
    (item) =>
      item.fnsku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
  const handleExport = () => {
    if (filteredItems.length === 0) {
      toast.warning('No items to export.');
      return;
    }
    const dataToExport = filteredItems.map(item => ({
      FNSKU: item.fnsku,
      'Local SKU': item.sku,
      'Scanned At': format(new Date(item.scannedAt), 'yyyy-MM-dd HH:mm:ss'),
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    link.setAttribute('download', `edgescan_inventory_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV export started.');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-amazon-blue font-display">Inventory List</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View, search, and manage all scanned FNSKU-SKU pairs.
          </p>
        </header>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by FNSKU or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} disabled={filteredItems.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={scannedItems.length === 0 || clearAllMutation.isPending}
            >
              {clearAllMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Clear All
            </Button>
          </div>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[200px]">FNSKU</TableHead>
                <TableHead>Local SKU</TableHead>
                <TableHead className="text-right">Scanned At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-48 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-red-500">
                    Error loading data: {error.message}
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono font-medium">{item.fnsku}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(item.scannedAt), 'PPpp')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No items found. Start scanning to populate the list.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}