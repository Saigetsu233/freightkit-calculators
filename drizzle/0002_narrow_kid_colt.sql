CREATE TABLE `crawler_hits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_date` text NOT NULL,
	`crawler` text NOT NULL,
	`path` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_crawler_hits_event_date` ON `crawler_hits` (`event_date`);--> statement-breakpoint
CREATE INDEX `idx_crawler_hits_event_date_crawler` ON `crawler_hits` (`event_date`,`crawler`);--> statement-breakpoint
ALTER TABLE `page_views` ADD `source_channel` text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_page_views_event_date_source` ON `page_views` (`event_date`,`source_channel`);