-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_friendOfId_fkey";

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
