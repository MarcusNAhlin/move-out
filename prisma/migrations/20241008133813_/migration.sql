-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "pin" TEXT,
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT false;
