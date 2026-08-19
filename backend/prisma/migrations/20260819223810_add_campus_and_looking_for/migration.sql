-- AlterTable
ALTER TABLE "users" ADD COLUMN     "campus" TEXT,
ADD COLUMN     "lookingFor" TEXT[] DEFAULT ARRAY[]::TEXT[];
