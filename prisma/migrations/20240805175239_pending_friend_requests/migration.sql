-- CreateTable
CREATE TABLE "_PendingFriendRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PendingFriendRequests_AB_unique" ON "_PendingFriendRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_PendingFriendRequests_B_index" ON "_PendingFriendRequests"("B");

-- AddForeignKey
ALTER TABLE "_PendingFriendRequests" ADD CONSTRAINT "_PendingFriendRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PendingFriendRequests" ADD CONSTRAINT "_PendingFriendRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
