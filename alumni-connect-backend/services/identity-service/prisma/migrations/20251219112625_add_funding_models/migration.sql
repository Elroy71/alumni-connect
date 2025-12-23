-- CreateEnum
CREATE TYPE "identity_schema"."CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "identity_schema"."Campaign" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "story" TEXT,
    "coverImage" TEXT,
    "category" TEXT NOT NULL,
    "goalAmount" INTEGER NOT NULL,
    "currentAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "identity_schema"."CampaignStatus" NOT NULL DEFAULT 'ACTIVE',
    "beneficiary" TEXT,
    "bankAccount" TEXT,
    "phoneNumber" TEXT,
    "updates" JSONB,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_schema"."Donation" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "paymentProof" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campaign_creatorId_idx" ON "identity_schema"."Campaign"("creatorId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "identity_schema"."Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_category_idx" ON "identity_schema"."Campaign"("category");

-- CreateIndex
CREATE INDEX "Campaign_endDate_idx" ON "identity_schema"."Campaign"("endDate");

-- CreateIndex
CREATE INDEX "Donation_campaignId_idx" ON "identity_schema"."Donation"("campaignId");

-- CreateIndex
CREATE INDEX "Donation_donorId_idx" ON "identity_schema"."Donation"("donorId");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "identity_schema"."Donation"("status");

-- AddForeignKey
ALTER TABLE "identity_schema"."Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "identity_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_schema"."Donation" ADD CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "identity_schema"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_schema"."Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "identity_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
