-- CreateEnum
CREATE TYPE "identity_schema"."Role" AS ENUM ('ALUMNI', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "identity_schema"."AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- CreateTable
CREATE TABLE "identity_schema"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "identity_schema"."Role" NOT NULL DEFAULT 'ALUMNI',
    "status" "identity_schema"."AccountStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_schema"."profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nim" TEXT,
    "batch" TEXT,
    "major" TEXT,
    "graduationYear" INTEGER,
    "phone" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_schema"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "identity_schema"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "identity_schema"."profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nim_key" ON "identity_schema"."profiles"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "identity_schema"."refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "identity_schema"."profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
