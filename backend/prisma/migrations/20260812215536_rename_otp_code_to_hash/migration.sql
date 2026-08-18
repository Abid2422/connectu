/*
  Warnings:

  - You are about to drop the column `otpCode` on the `otps` table. All the data in the column will be lost.
  - Added the required column `otpHash` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "otps" DROP COLUMN "otpCode",
ADD COLUMN     "otpHash" TEXT NOT NULL;
