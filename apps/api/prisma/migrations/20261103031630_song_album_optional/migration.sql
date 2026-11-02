-- AlterTable
ALTER TABLE `songs` ADD COLUMN `album` VARCHAR(200) NULL;

-- CreateIndex
CREATE INDEX `songs_album_idx` ON `songs`(`album`);