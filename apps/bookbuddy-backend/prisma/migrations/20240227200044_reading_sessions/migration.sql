/*
  Warnings:

  - You are about to drop the column `pagesRead` on the `ReadingSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReadingSession" DROP COLUMN "pagesRead",
ADD COLUMN     "pageEnd" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pageStart" INTEGER NOT NULL DEFAULT 0;
