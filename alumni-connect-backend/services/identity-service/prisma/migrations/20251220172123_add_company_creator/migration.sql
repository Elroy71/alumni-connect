/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `Company` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "identity_schema"."Company_name_key";

-- DropIndex
DROP INDEX "identity_schema"."Company_slug_key";

-- AlterTable
ALTER TABLE "identity_schema"."Company" DROP COLUMN "coverImage",
DROP COLUMN "slug",
DROP COLUMN "socialLinks",
ADD COLUMN     "createdBy" TEXT;

-- CreateIndex
CREATE INDEX "Company_createdBy_idx" ON "identity_schema"."Company"("createdBy");

-- AddForeignKey
ALTER TABLE "identity_schema"."Company" ADD CONSTRAINT "Company_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "identity_schema"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
