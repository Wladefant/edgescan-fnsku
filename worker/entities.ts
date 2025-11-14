import { IndexedEntity } from "./core-utils";
import type { ScannedItem } from "@shared/types";
export class ScannedItemEntity extends IndexedEntity<ScannedItem> {
  static readonly entityName = "scannedItem";
  static readonly indexName = "scannedItems";
  static readonly initialState: ScannedItem = { id: "", fnsku: "", sku: "", scannedAt: "" };
}