-- CreateEnum
CREATE TYPE "AnalyticsChannel" AS ENUM ('NFC_TAP', 'QR_SCAN', 'DIRECT_LINK');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('PROFILE_VIEW', 'SAVE_CONTACT');

-- CreateTable
CREATE TABLE "analytics_event" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "nfc_card_id" TEXT,
    "event_type" "AnalyticsEventType" NOT NULL,
    "channel" "AnalyticsChannel" NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visitor_ip" TEXT,
    "country" TEXT,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_event_organization_id_idx" ON "analytics_event"("organization_id");

-- CreateIndex
CREATE INDEX "analytics_event_profile_id_idx" ON "analytics_event"("profile_id");

-- CreateIndex
CREATE INDEX "analytics_event_nfc_card_id_idx" ON "analytics_event"("nfc_card_id");

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_nfc_card_id_fkey" FOREIGN KEY ("nfc_card_id") REFERENCES "nfc_card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
