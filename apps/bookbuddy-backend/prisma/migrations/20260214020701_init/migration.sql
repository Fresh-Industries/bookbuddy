-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_readingSessionId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "pageNumber" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "readingSessionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ReadingSession" ADD COLUMN     "endedAt" TIMESTAMP(3),
ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Highlight" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userBookId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "pageNumber" INTEGER,
    "chapter" TEXT,
    "color" TEXT NOT NULL DEFAULT 'yellow',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingGoal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "type" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalPagesRead" INTEGER NOT NULL DEFAULT 0,
    "totalBooksRead" INTEGER NOT NULL DEFAULT 0,
    "totalMinutesRead" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastReadDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "favoriteGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favoriteAuthors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dislikeGenres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readingSpeed" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Highlight_userId_idx" ON "Highlight"("userId");

-- CreateIndex
CREATE INDEX "Highlight_userBookId_idx" ON "Highlight"("userBookId");

-- CreateIndex
CREATE INDEX "ReadingGoal_userId_idx" ON "ReadingGoal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingGoal_userId_year_month_type_key" ON "ReadingGoal"("userId", "year", "month", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- CreateIndex
CREATE INDEX "UserStats_userId_idx" ON "UserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_readingSessionId_fkey" FOREIGN KEY ("readingSessionId") REFERENCES "ReadingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_userBookId_fkey" FOREIGN KEY ("userBookId") REFERENCES "UserBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingGoal" ADD CONSTRAINT "ReadingGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStats" ADD CONSTRAINT "UserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
