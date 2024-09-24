-- CreateEnum
CREATE TYPE "LabelType" AS ENUM ('NORMAL', 'FRAGILE', 'HAZARDOUS');

-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "type" "LabelType" NOT NULL DEFAULT 'NORMAL';
