/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Mat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Color" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MatColor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "spec" INTEGER NOT NULL,
    "thick" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatColor_matId_fkey" FOREIGN KEY ("matId") REFERENCES "Mat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatColorPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matColorId" INTEGER NOT NULL,
    "priceTypeId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatColorPrice_matColorId_fkey" FOREIGN KEY ("matColorId") REFERENCES "MatColor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatColorPrice_priceTypeId_fkey" FOREIGN KEY ("priceTypeId") REFERENCES "MatColorPriceType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatColorPriceType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
