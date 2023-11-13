/*
  Warnings:

  - Added the required column `mapImagebase64` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Map" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "mapText" TEXT NOT NULL,
    "mapImagebase64" TEXT NOT NULL,
    "mapImageUrl" TEXT NOT NULL,
    "xMapSize" INTEGER NOT NULL,
    "yMapSize" INTEGER NOT NULL
);
INSERT INTO "new_Map" ("id", "mapImageUrl", "mapText", "name", "xMapSize", "yMapSize") SELECT "id", "mapImageUrl", "mapText", "name", "xMapSize", "yMapSize" FROM "Map";
DROP TABLE "Map";
ALTER TABLE "new_Map" RENAME TO "Map";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
