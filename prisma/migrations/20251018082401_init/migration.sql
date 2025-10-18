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
    "minDog" REAL,
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
    "refId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MatColorPrice_matColorId_fkey" FOREIGN KEY ("matColorId") REFERENCES "MatColor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatColorPrice_priceTypeId_fkey" FOREIGN KEY ("priceTypeId") REFERENCES "MatColorPriceType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatColorPriceType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "remark" TEXT,
    "priceModel" TEXT NOT NULL DEFAULT '按面积',
    "unit" TEXT NOT NULL DEFAULT '平方',
    "expression" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "ruleTypeId" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PriceVersion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matColorPriceId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceVersion_matColorPriceId_fkey" FOREIGN KEY ("matColorPriceId") REFERENCES "MatColorPrice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hash" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PriceAttachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "priceVersionId" INTEGER NOT NULL,
    "attachmentId" INTEGER NOT NULL,
    CONSTRAINT "PriceAttachment_priceVersionId_fkey" FOREIGN KEY ("priceVersionId") REFERENCES "PriceVersion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PriceAttachment_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_hash_key" ON "Attachment"("hash");
