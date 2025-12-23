/*
  Warnings:

  - A unique constraint covering the columns `[cardNumber]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "identity_schema"."Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "identity_schema"."profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Indonesia',
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "currentCompany" TEXT,
ADD COLUMN     "currentPosition" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" "identity_schema"."Gender",
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "identity_schema"."users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "profiles_cardNumber_key" ON "identity_schema"."profiles"("cardNumber");
