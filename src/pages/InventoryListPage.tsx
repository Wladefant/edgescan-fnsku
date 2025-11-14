import { useState } from 'react';
import { useStore } from '@/lib/store';
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
import { Download, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
export function InventoryListPage() {
  const scannedItems = useStore((state) => state.scannedItems);
  const clearItems = useStore((state) => state.clearItems);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredItems = scannedItems.filter(
    (item) =>
      item.fnsku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all scanned items? This action cannot be undone.')) {
      clearItems();
      toast.success('All items have been cleared.');
    }
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
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={scannedItems.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
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
              {filteredItems.length > 0 ? (
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