import { Hono } from "hono";
import type { Env } from './core-utils';
import { ScannedItemEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
import { ScannedItem } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // HEALTH CHECK & TEST
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'EdgeScan FNSKU Worker' }}));
  // GET ALL SCANNED ITEMS
  app.get('/api/items', async (c) => {
    // Note: For very large datasets, pagination would be needed here.
    // The current implementation fetches all items, which is suitable for moderate scale.
    const { items } = await ScannedItemEntity.list(c.env, null, 10000); // High limit for now
    return ok(c, items);
  });
  // CREATE A NEW SCANNED ITEM
  app.post('/api/items', async (c) => {
    const { fnsku, sku } = (await c.req.json()) as { fnsku?: string; sku?: string };
    if (!isStr(fnsku) || !isStr(sku)) {
      return bad(c, 'fnsku and sku are required');
    }
    const newItem: ScannedItem = {
      id: crypto.randomUUID(),
      fnsku,
      sku,
      scannedAt: new Date().toISOString(),
    };
    const created = await ScannedItemEntity.create(c.env, newItem);
    return ok(c, created);
  });
  // DELETE ALL SCANNED ITEMS
  app.post('/api/items/delete-all', async (c) => {
    const { items: allItems } = await ScannedItemEntity.list(c.env, null, 10000); // High limit
    const idsToDelete = allItems.map(item => item.id);
    if (idsToDelete.length > 0) {
      const deletedCount = await ScannedItemEntity.deleteMany(c.env, idsToDelete);
      return ok(c, { deletedCount });
    }
    return ok(c, { deletedCount: 0 });
  });
}