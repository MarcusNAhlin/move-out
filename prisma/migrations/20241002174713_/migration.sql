/*
  Warnings:

  - You are about to drop the column `soundPath` on the `Label` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[soundName]` on the table `Label` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Label_soundPath_key";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "soundPath",
ADD COLUMN     "soundName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Label_soundName_key" ON "Label"("soundName");
