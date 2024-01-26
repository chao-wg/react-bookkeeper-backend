/*
  Warnings:

  - You are about to drop the column `tag_ids` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `tag_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "tag_ids",
ADD COLUMN     "tag_id" INTEGER NOT NULL;
