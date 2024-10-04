-- CreateTable
CREATE TABLE "DeleteToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeleteToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeleteToken_userId_key" ON "DeleteToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeleteToken_token_key" ON "DeleteToken"("token");

-- AddForeignKey
ALTER TABLE "DeleteToken" ADD CONSTRAINT "DeleteToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
