-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags_collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
