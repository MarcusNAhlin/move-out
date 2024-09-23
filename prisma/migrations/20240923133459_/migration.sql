-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "picturePath" TEXT NOT NULL,
    "soundPath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_userId_key" ON "Label"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Label_picturePath_key" ON "Label"("picturePath");

-- CreateIndex
CREATE UNIQUE INDEX "Label_soundPath_key" ON "Label"("soundPath");

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
