CREATE TABLE `interaction_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_date` text NOT NULL,
	`path` text NOT NULL,
	`event_type` text DEFAULT 'calculation_completed' NOT NULL,
	`event_label` text DEFAULT '' NOT NULL,
	`source_host` text DEFAULT '' NOT NULL,
	`visitor_hash` text NOT NULL,
	`is_internal` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_interactions_event_date` ON `interaction_events` (`event_date`);--> statement-breakpoint
CREATE INDEX `idx_interactions_event_date_path` ON `interaction_events` (`event_date`,`path`);--> statement-breakpoint
CREATE INDEX `idx_interactions_event_type` ON `interaction_events` (`event_date`,`event_type`);