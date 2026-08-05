import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pageViews = sqliteTable(
  "page_views",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventDate: text("event_date").notNull(),
    path: text("path").notNull(),
    referrerHost: text("referrer_host").notNull().default(""),
    sourceChannel: text("source_channel").notNull().default(""),
    visitorHash: text("visitor_hash").notNull(),
    isInternal: integer("is_internal"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_page_views_event_date").on(table.eventDate),
    index("idx_page_views_event_date_path").on(table.eventDate, table.path),
    index("idx_page_views_event_date_source").on(table.eventDate, table.sourceChannel),
  ],
);

export const crawlerHits = sqliteTable(
  "crawler_hits",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventDate: text("event_date").notNull(),
    crawler: text("crawler").notNull(),
    path: text("path").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_crawler_hits_event_date").on(table.eventDate),
    index("idx_crawler_hits_event_date_crawler").on(table.eventDate, table.crawler),
  ],
);
