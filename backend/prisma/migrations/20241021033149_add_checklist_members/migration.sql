-- CreateTable
CREATE TABLE "_ChecklistMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChecklistMembers_AB_unique" ON "_ChecklistMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChecklistMembers_B_index" ON "_ChecklistMembers"("B");

-- AddForeignKey
ALTER TABLE "_ChecklistMembers" ADD CONSTRAINT "_ChecklistMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChecklistMembers" ADD CONSTRAINT "_ChecklistMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
