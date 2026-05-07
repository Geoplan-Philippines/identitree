-- CreateEnum
CREATE TYPE "TemplateAvailability" AS ENUM ('GLOBAL', 'ORG_ONLY');

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "template_id" TEXT;

-- CreateTable
CREATE TABLE "template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "preview_image_url" TEXT,
    "layout_key" TEXT NOT NULL DEFAULT 'default',
    "config" JSONB,
    "availability" "TemplateAvailability" NOT NULL DEFAULT 'GLOBAL',
    "organization_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template" ADD CONSTRAINT "template_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
