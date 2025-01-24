/*
  Warnings:

  - You are about to drop the column `publishedDate` on the `UserBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserBook" DROP COLUMN "publishedDate",
ADD COLUMN     "categories" TEXT[];
