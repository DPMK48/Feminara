-- CreateEnum
CREATE TYPE "LessonContentType" AS ENUM ('VIDEO', 'IMAGE', 'TEXT');

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" TEXT,
    "durationMinutes" INTEGER,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonContent" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "contentType" "LessonContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "textBody" TEXT,
    "mediaUrl" TEXT,
    "mediaThumbnailUrl" TEXT,
    "durationMinutes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LessonContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LessonContent_lessonId_language_idx" ON "LessonContent"("lessonId", "language");

-- AddForeignKey
ALTER TABLE "LessonContent" ADD CONSTRAINT "LessonContent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
