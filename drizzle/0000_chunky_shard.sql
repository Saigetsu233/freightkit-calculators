CREATE TABLE `page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_date` text NOT NULL,
	`path` text NOT NULL,
	`referrer_host` text DEFAULT '' NOT NULL,
	`visitor_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_page_views_event_date` ON `page_views` (`event_date`);--> statement-breakpoint
CREATE INDEX `idx_page_views_event_date_path` ON `page_views` (`event_date`,`path`);--> statement-breakpoint
PRAGMA optimize;
