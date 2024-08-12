/*
  Warnings:

  - You are about to drop the `_UserFriends` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_UserFriends" DROP CONSTRAINT "_UserFriends_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFriends" DROP CONSTRAINT "_UserFriends_B_fkey";

-- DropTable
DROP TABLE "_UserFriends";

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "friendOfId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendOfId_fkey" FOREIGN KEY ("friendOfId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
