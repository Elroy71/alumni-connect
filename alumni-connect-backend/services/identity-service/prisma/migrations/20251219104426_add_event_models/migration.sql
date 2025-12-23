-- CreateEnum
CREATE TYPE "identity_schema"."EventType" AS ENUM ('WEBINAR', 'WORKSHOP', 'MEETUP', 'REUNION', 'SEMINAR', 'NETWORKING', 'CONFERENCE');

-- CreateEnum
CREATE TYPE "identity_schema"."EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "identity_schema"."RegistrationStatus" AS ENUM ('REGISTERED', 'CONFIRMED', 'ATTENDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "identity_schema"."Event" (
    "id" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "identity_schema"."EventType" NOT NULL,
    "status" "identity_schema"."EventStatus" NOT NULL DEFAULT 'PUBLISHED',
    "coverImage" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "meetingUrl" TEXT,
    "capacity" INTEGER,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "tags" TEXT[],
    "requirements" TEXT,
    "agenda" TEXT,
    "speakers" JSONB,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_schema"."Registration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "identity_schema"."RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "notes" TEXT,
    "attendedAt" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_organizerId_idx" ON "identity_schema"."Event"("organizerId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "identity_schema"."Event"("status");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "identity_schema"."Event"("type");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "identity_schema"."Event"("startDate");

-- CreateIndex
CREATE INDEX "Registration_userId_idx" ON "identity_schema"."Registration"("userId");

-- CreateIndex
CREATE INDEX "Registration_status_idx" ON "identity_schema"."Registration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_eventId_userId_key" ON "identity_schema"."Registration"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "identity_schema"."Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "identity_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_schema"."Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "identity_schema"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identity_schema"."Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity_schema"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
