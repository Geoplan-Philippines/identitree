-- CreateEnum
CREATE TYPE "NfcCardType" AS ENUM ('GEOPLAN_ISSUED', 'CUSTOMER_OWNED');

-- CreateEnum
CREATE TYPE "NfcCardStatus" AS ENUM ('UNASSIGNED', 'UNACTIVATED', 'ACTIVE', 'INACTIVE', 'LOST', 'REPLACED');

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "owner_user_id" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT,
    "position_title" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "linkedin_username" TEXT,
    "whatsapp_number" TEXT,
    "viber_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfc_card" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "profile_id" TEXT,
    "hardware_id" TEXT,
    "card_type" "NfcCardType" NOT NULL,
    "encoded_url" TEXT NOT NULL,
    "status" "NfcCardStatus" NOT NULL DEFAULT 'UNASSIGNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfc_card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nfc_card_hardware_id_key" ON "nfc_card"("hardware_id");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfc_card" ADD CONSTRAINT "nfc_card_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nfc_card" ADD CONSTRAINT "nfc_card_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
