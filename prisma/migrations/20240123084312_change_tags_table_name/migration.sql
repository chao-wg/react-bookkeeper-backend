/*
  Warnings:

  - You are about to drop the `tagsCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tagsCollection" DROP CONSTRAINT "tagsCollection_user_id_fkey";

-- DropTable
DROP TABLE "tagsCollection";

-- CreateTable
CREATE TABLE "tags_collection" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" "Kind" NOT NULL,

    CONSTRAINT "tags_collection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tags_collection" ADD CONSTRAINT "tags_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
