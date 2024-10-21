/*
  Warnings:

  - Added the required column `title` to the `diagnostics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diagnostics" ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "descr" TEXT,
    "diagnosticId" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_answers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "diagnosticId" TEXT NOT NULL,
    "response" JSONB NOT NULL,

    CONSTRAINT "client_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questions_id_key" ON "questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_id_key" ON "answers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_answers_id_key" ON "client_answers"("id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "diagnostics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_answers" ADD CONSTRAINT "client_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_answers" ADD CONSTRAINT "client_answers_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "diagnostics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
