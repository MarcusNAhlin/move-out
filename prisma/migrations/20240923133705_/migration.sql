-- AlterTable
ALTER TABLE "Label" ALTER COLUMN "text" DROP NOT NULL,
ALTER COLUMN "picturePath" DROP NOT NULL,
ALTER COLUMN "soundPath" DROP NOT NULL;