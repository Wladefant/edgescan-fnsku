import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { ScannedItem } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Barcode, Scan, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, startOfDay } from 'date-fns';
const COLORS = ['#FF9900', '#232F3E', '#8884d8', '#82ca9d', '#ffc658'];
export function AnalyticsPage() {
  const { data: scannedItems = [], isLoading } = useQuery<ScannedItem[]>({
    queryKey: ['scannedItems'],
    queryFn: () => api('/api/items'),
  });
  const analyticsData = useMemo(() => {
    if (!scannedItems || scannedItems.length === 0) {
      return {
        totalScans: 0,
        uniqueFnsks: 0,
        scansToday: 0,
        dailyScans: [],
        skuDistribution: [],
      };
    }
    const totalScans = scannedItems.length;
    const uniqueFnsks = new Set(scannedItems.map(item => item.fnsku)).size;
    const today = startOfDay(new Date());
    const scansToday = scannedItems.filter(item => startOfDay(new Date(item.scannedAt)) >= today).length;
    const scansByDay = scannedItems.reduce((acc, item) => {
      const day = format(new Date(item.scannedAt), 'yyyy-MM-dd');
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const dailyScans = Object.entries(scansByDay)
      .map(([date, scans]) => ({ name: format(new Date(date), 'MMM d'), scans }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
      .slice(-7); // Last 7 days
    const skusByPrefix = scannedItems.reduce((acc, item) => {
        const prefix = item.sku.split('-')[0] || 'Uncategorized';
        acc[prefix] = (acc[prefix] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const skuDistribution = Object.entries(skusByPrefix).map(([name, value]) => ({ name, value }));
    return { totalScans, uniqueFnsks, scansToday, dailyScans, skuDistribution };
  }, [scannedItems]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-amazon-blue font-display">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Visualize your scanning activity and inventory data.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Scan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-7 w-24" /> : <div className="text-2xl font-bold">{analyticsData.totalScans}</div>}
              <p className="text-xs text-muted-foreground">All-time recorded scans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique FNSKUs</CardTitle>
              <Barcode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-7 w-16" /> : <div className="text-2xl font-bold">{analyticsData.uniqueFnsks}</div>}
              <p className="text-xs text-muted-foreground">Distinct products scanned</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-7 w-12" /> : <div className="text-2xl font-bold">{analyticsData.scansToday}</div>}
              <p className="text-xs text-muted-foreground">Since midnight</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Last 7 Days Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[300px] w-full" /> :
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData.dailyScans}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="scans" fill="#FF9900" />
                        </BarChart>
                    </ResponsiveContainer>
                    }
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>SKU Distribution (by prefix)</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-[300px] w-full" /> :
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analyticsData.skuDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analyticsData.skuDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    }
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}