/*
  Warnings:

  - A unique constraint covering the columns `[encoded_url]` on the table `nfc_card` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "nfc_card_encoded_url_key" ON "nfc_card"("encoded_url");
