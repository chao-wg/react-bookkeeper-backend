/*
  Warnings:

  - You are about to drop the `tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Kind" AS ENUM ('income', 'expenses');

-- DropTable
DROP TABLE "tag";

-- CreateTable
CREATE TABLE "tagsCollection" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" "Kind" NOT NULL,

    CONSTRAINT "tagsCollection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tagsCollection" ADD CONSTRAINT "tagsCollection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
