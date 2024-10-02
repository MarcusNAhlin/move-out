/*
  Warnings:

  - You are about to drop the column `picturePath` on the `Label` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Label_picturePath_key";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "picturePath",
ADD COLUMN     "imageName" TEXT;
