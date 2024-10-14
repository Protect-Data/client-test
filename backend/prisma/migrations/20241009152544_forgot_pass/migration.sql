-- CreateTable
CREATE TABLE "RedefinePass" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "RedefinePass_pkey" PRIMARY KEY ("id")
);
