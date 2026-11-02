-- DropIndex
DROP INDEX `artists_name_idx` ON `artists`;

-- CreateIndex
CREATE UNIQUE INDEX `artists_name_key` ON `artists`(`name`);
