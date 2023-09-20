import { views } from '../db/schema';
import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

export interface IviewsSerivce {
  increment(slug: string): Promise<void>;
  list(): Promise<[{ slug: string; views: number }]>;
}

export class viewsService implements IviewsSerivce {
  #db: DrizzleD1Database;

  constructor(d1: D1Database) {
    this.#db = drizzle(d1);
  }

  async increment(slug: string) {
    await this.#db.transaction(async (tx) => {
      const v = await tx.select().from(views).where(eq(views.slug, slug));
      if (v.length === 0) {
        await tx.insert(views).values({ slug, views: 1 });
      } else {
        await tx
          .update(views)
          .set({ views: v[0].views + 1 })
          .where(eq(views.slug, slug));
      }
    });
  }

  async list() {
    return await this.#db.select().from(views);
  }
}
