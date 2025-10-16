-- AlterTable
ALTER TABLE "MatColorPriceType" ADD COLUMN "remark" TEXT;

-- CreateTable
CREATE TABLE "MatColorPriceLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matColorPriceId" INTEGER NOT NULL,
    "oldPrice" REAL NOT NULL DEFAULT 0,
    "newPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MatColorPriceLog_matColorPriceId_fkey" FOREIGN KEY ("matColorPriceId") REFERENCES "MatColorPrice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
