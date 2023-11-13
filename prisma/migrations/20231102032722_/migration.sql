-- CreateTable
CREATE TABLE "Chapter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapId" INTEGER NOT NULL,
    CONSTRAINT "Chapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapter_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Map" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mapText" TEXT NOT NULL,
    "mapImageUrl" TEXT NOT NULL,
    "xMapSize" INTEGER NOT NULL,
    "yMapSize" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ExplorationPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xPosition" INTEGER NOT NULL,
    "yPosition" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "pointIntroductionText" TEXT NOT NULL,
    "pointChallangeText" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExplorationPoint_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExplorationPointPreviousRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "previousPointId" INTEGER NOT NULL,
    "nextPointId" INTEGER NOT NULL
);
