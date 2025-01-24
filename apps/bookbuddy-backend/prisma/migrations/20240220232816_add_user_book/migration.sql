/*
  Warnings:

  - Added the required column `title` to the `UserBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "authors" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "publishedDate" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
