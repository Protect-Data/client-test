/*
  Warnings:

  - You are about to drop the `RedefinePass` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RedefinePass";

-- CreateTable
CREATE TABLE "redefinePass" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "redefinePass_pkey" PRIMARY KEY ("id")
);
