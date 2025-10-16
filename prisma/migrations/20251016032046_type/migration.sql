-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MatColorPriceType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "priceModel" TEXT NOT NULL DEFAULT '按面积',
    "unit" TEXT NOT NULL DEFAULT '平方',
    "expression" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MatColorPriceType" ("createdAt", "id", "name", "remark", "updatedAt") SELECT "createdAt", "id", "name", "remark", "updatedAt" FROM "MatColorPriceType";
DROP TABLE "MatColorPriceType";
ALTER TABLE "new_MatColorPriceType" RENAME TO "MatColorPriceType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
