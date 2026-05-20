-- CreateTable
CREATE TABLE "UserCV" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "fileUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CVEdit" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "reason" TEXT,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CVEdit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserCV" ADD CONSTRAINT "UserCV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVEdit" ADD CONSTRAINT "CVEdit_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "UserCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;
