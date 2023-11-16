-- AlterTable
ALTER TABLE "ExplorationPoint" ADD COLUMN     "diceAmout" INTEGER,
ADD COLUMN     "diceAmoutToSuccess" INTEGER,
ADD COLUMN     "diceMinValueToSuccess" INTEGER,
ADD COLUMN     "failText" TEXT,
ADD COLUMN     "successText" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT E'text';

-- CreateTable
CREATE TABLE "Enemy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lifePoints" INTEGER NOT NULL DEFAULT 1,
    "attackPoints" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enemy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorationPointEnemy" (
    "explorationPointId" INTEGER NOT NULL,
    "enemyId" INTEGER NOT NULL,

    CONSTRAINT "ExplorationPointEnemy_pkey" PRIMARY KEY ("explorationPointId","enemyId")
);

-- AddForeignKey
ALTER TABLE "ExplorationPointEnemy" ADD CONSTRAINT "ExplorationPointEnemy_explorationPointId_fkey" FOREIGN KEY ("explorationPointId") REFERENCES "ExplorationPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorationPointEnemy" ADD CONSTRAINT "ExplorationPointEnemy_enemyId_fkey" FOREIGN KEY ("enemyId") REFERENCES "Enemy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
