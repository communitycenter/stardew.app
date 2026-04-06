CREATE TABLE `Saves` (
	`_id` varchar(64) NOT NULL,
	`user_id` varchar(64) NOT NULL,
	`general` json NOT NULL DEFAULT ('{}'),
	`fishing` json NOT NULL DEFAULT ('{}'),
	`cooking` json NOT NULL DEFAULT ('{}'),
	`crafting` json NOT NULL DEFAULT ('{}'),
	`shipping` json NOT NULL DEFAULT ('{}'),
	`museum` json NOT NULL DEFAULT ('{}'),
	`social` json NOT NULL DEFAULT ('{}'),
	`monsters` json NOT NULL DEFAULT ('{}'),
	`walnuts` json NOT NULL DEFAULT ('{}'),
	`notes` json NOT NULL DEFAULT ('{}'),
	`scraps` json NOT NULL DEFAULT ('{}'),
	`perfection` json NOT NULL DEFAULT ('{}'),
	`powers` json NOT NULL DEFAULT ('{}'),
	`bundles` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `Saves__id` PRIMARY KEY(`_id`),
	CONSTRAINT `Saves__id_unique` UNIQUE(`_id`),
	CONSTRAINT `Saves_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` varchar(64) NOT NULL,
	`discord_id` varchar(191) NOT NULL,
	`cookie_secret` varchar(191) NOT NULL,
	`discord_avatar` varchar(64) NOT NULL,
	`discord_name` varchar(64) NOT NULL,
	CONSTRAINT `Users_id` PRIMARY KEY(`id`),
	CONSTRAINT `Users_id_unique` UNIQUE(`id`),
	CONSTRAINT `Users_discord_id_unique` UNIQUE(`discord_id`),
	CONSTRAINT `Users_cookie_secret_unique` UNIQUE(`cookie_secret`)
);
--> statement-breakpoint
CREATE INDEX `Saves_user_id` ON `Saves` (`user_id`);--> statement-breakpoint
CREATE INDEX `Users_id` ON `Users` (`id`);--> statement-breakpoint
CREATE INDEX `Users_discord_id` ON `Users` (`discord_id`);
