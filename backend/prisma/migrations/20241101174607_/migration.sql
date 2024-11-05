-- CreateTable
CREATE TABLE "politics" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "signHash" TEXT,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "politics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "politics_id_key" ON "politics"("id");

-- AddForeignKey
ALTER TABLE "politics" ADD CONSTRAINT "politics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
