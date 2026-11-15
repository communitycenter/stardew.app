-- Applied by hand to production on 2026-11-14.
-- Production was never managed by drizzle-kit migrate (__drizzle_migrations is
-- empty and src/drizzle/*.sql don't match the live tables), so don't run
-- `drizzle-kit migrate` against it.

-- Fail fast instead of queueing behind live queries and blocking traffic.
SET SESSION lock_wait_timeout = 5;

-- Last time a save was written. Existing rows stay NULL ("not written since
-- tracking began"), so the column can be used to find active saves later.
-- INSTANT = metadata-only, no table rebuild of the ~9 GB table.
ALTER TABLE `Saves`
	ADD COLUMN `updated_at` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	ALGORITHM = INSTANT;

-- (user_id, _id) duplicates the primary key's uniqueness and Saves_user_id
-- already serves user_id lookups.
ALTER TABLE `Saves` DROP INDEX `Unique_user_id_player`, ALGORITHM = INPLACE, LOCK = NONE;

-- Users_id duplicates PRIMARY; Users_discord_id duplicates Users_discord_id_key.
ALTER TABLE `Users`
	DROP INDEX `Users_id`,
	DROP INDEX `Users_discord_id`,
	ALGORITHM = INPLACE, LOCK = NONE;
