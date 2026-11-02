-- DropIndex
DROP INDEX `artists_name_key` ON `artists`;

-- CreateIndex
CREATE INDEX `artists_name_idx` ON `artists`(`name`);