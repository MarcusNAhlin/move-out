-- CreateTable
CREATE TABLE "UserDeleted" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash_pass" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "deactivated" TIMESTAMP(3),
    "lastAction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "UserDeleted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxDeleted" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "LabelType" NOT NULL DEFAULT 'NORMAL',
    "private" BOOLEAN NOT NULL DEFAULT false,
    "pin" TEXT,
    "text" TEXT,
    "imageName" TEXT,
    "soundName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoxDeleted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDeleted_email_key" ON "UserDeleted"("email");

-- AddForeignKey
ALTER TABLE "BoxDeleted" ADD CONSTRAINT "BoxDeleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserDeleted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
