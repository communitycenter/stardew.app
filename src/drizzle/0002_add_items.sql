ALTER TABLE `Saves` ADD `items` json DEFAULT ('{}') NOT NULL;--> statement-breakpoint
ALTER TABLE `Saves` ADD `rarecrows` json DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `Saves` ADD `animals` json DEFAULT ('{}') NOT NULL;