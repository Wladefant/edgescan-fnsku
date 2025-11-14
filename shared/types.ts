export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface ScannedItem {
  id: string;
  fnsku: string;
  sku: string;
  scannedAt: string; // ISO 8601 string
}