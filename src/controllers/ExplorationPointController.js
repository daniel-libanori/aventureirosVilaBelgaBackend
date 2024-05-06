import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async CreateExplorationPoint(req, res) {
    const { chapterId } = req.params;
    const {
      name,
      code,
      xPosition,
      yPosition,
      pointIntroductionText,
      type,
      successText,
      failText,
      diceAmout,
      diceMinValueToSuccess,
      diceAmoutToSuccess,
      pointChallangeText,
      previousExplorationPointsId,
      nextExplorationPointsId,
      enemiesArray,
      expPointEnemyOrPerson,
    } = req.body;

    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id: Number(chapterId) },
      });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }
      const explorationPoints = await prisma.explorationPoint.create({
        data: {
          name,
          code,
          xPosition,
          yPosition,
          pointIntroductionText,
          pointChallangeText,
          type,
          successText,
          failText,
          diceAmout,
          diceMinValueToSuccess,
          diceAmoutToSuccess,
          enemiesArray,
          expPointEnemyOrPerson,
          chapter: {
            connect: {
              id: Number(chapterId),
            },
          },
        },
      });

      if (
        Array.isArray(previousExplorationPointsId) &&
        previousExplorationPointsId.length > 0
      ) {
        const promises = previousExplorationPointsId.map((expId) => {
          return prisma.explorationPointPreviousRelation.create({
            data: {
              previousPointId: expId,
              nextPointId: explorationPoints.id,
            },
          });
        });

        const previousExplorationPointsRelation = await Promise.all(promises);
      }
      if (Array.isArray(nextExplorationPointsId)) {
        if (!!nextExplorationPointsId.length) {
          nextExplorationPointsId.map(async (expId) => {
            const nextExplorationPointsRelation = Promise.all(
              await prisma.explorationPointPreviousRelation.create({
                data: {
                  previousPointId: explorationPoints.id,
                  nextPointId: expId,
                },
              })
            );
          });
        }
      }

      return res.json(explorationPoints);
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  },

  async FindAllExplorationPoints(req, res) {
    const { chapterId } = req.params;
    const { getby } = req.query;

    try {
      const chapter = await prisma.chapter.findUnique({
        where: { id: Number(chapterId) },
      });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }

      const explorationPoints = await prisma.explorationPoint.findMany({
        where: { chapterId: Number(chapterId) },
      });

      const promises = explorationPoints.map((expPt) => {
        return prisma.explorationPointPreviousRelation.findMany({
          where: { nextPointId: expPt.id },
        });
      });

      const previousExplorationPointsRelation = await Promise.all(promises);

      const explorationPointsWithRelations = explorationPoints.map((point) => {
        const previousRelations = previousExplorationPointsRelation
          .filter((subArr) => subArr.length > 0)
          .flat()
          .filter((relation) => relation.nextPointId === point.id);
        const previousPoints = previousRelations.map((relation) => {
          return explorationPoints.find(
            (expPoint) => expPoint.id === relation.previousPointId
          );
        });
        return { ...point, previousRelation: previousPoints };
      });

      if (getby === "position") {
        function groupByPosition(array) {
          return array.reduce((result, item) => {
            const key = `${item.xPosition}-${item.yPosition}`;
            (result[key] = result[key] || []).push(item);
            return result;
          }, {});
        }

        return res.json(groupByPosition(explorationPointsWithRelations));
      }

      return res.json(explorationPointsWithRelations);
    } catch (error) {
      return res.json(error);
    }
  },

  async FindOneExplorationPoint(req, res) {
    const { explorationPointId } = req.params;

    try {
      const explorationPoint = await prisma.explorationPoint.findUnique({
        where: { id: Number(explorationPointId) },
      });

      if (!explorationPoint) {
        return res.json({ message: "Ponto de Exploração inexistente" });
      }

      const explorationPointRelations =
        await prisma.explorationPointPreviousRelation.findMany({
          where: { nextPointId: parseInt(explorationPointId) },
        });

      return res.json({
        ...explorationPoint,
        relations: explorationPointRelations,
      });
    } catch (error) {
      return res.json(error);
    }
  },

  async UpdateExplorationPoint(req, res) {
    const { explorationPointId } = req.params;
    const {
      name,
      code,
      xPosition,
      yPosition,
      pointIntroductionText,
      pointChallangeText,
      previousExplorationPointsId,
      nextExplorationPointsId,
      type,
      successText,
      failText,
      diceAmout,
      diceMinValueToSuccess,
      diceAmoutToSuccess,
      enemiesArray,
      expPointEnemyOrPerson,
    } = req.body;

    try {
      const explorationPoint = await prisma.explorationPoint.findUnique({
        where: { id: Number(explorationPointId) },
      });

      if (!explorationPoint) {
        return res.json({ message: "Ponto de Exploração inexistente" });
      }

      const explorationPointOldRelations =
        await prisma.explorationPointPreviousRelation.findMany({
          where: { nextPointId: parseInt(explorationPointId) },
        });

      async function removeUnwantedRelations() {
        const relationsToRemove = explorationPointOldRelations.filter(
          (relation) =>
            !previousExplorationPointsId.includes(relation.previousPointId)
        );

        for (const relation of relationsToRemove) {
          await prisma.explorationPointPreviousRelation.delete({
            where: { id: relation.id },
          });
        }
      }

      async function createNewRelations() {
        const newRelations = JSON.parse(previousExplorationPointsId).filter(
          (id) =>
            !explorationPointOldRelations.some(
              (relation) => relation.previousPointId === id
            )
        );

        for (const newId of newRelations) {
          await prisma.explorationPointPreviousRelation.create({
            data: {
              previousPointId: newId,
              nextPointId: parseInt(explorationPointId),
            },
          });
        }
      }

      const explorationPointUpdated = await prisma.explorationPoint.update({
        where: { id: Number(explorationPointId) },
        data: {
          name,
          code,
          xPosition,
          yPosition,
          pointIntroductionText,
          pointChallangeText,
          type,
          successText,
          failText,
          diceAmout,
          diceMinValueToSuccess,
          diceAmoutToSuccess,
          enemiesArray,
          expPointEnemyOrPerson,
        },
      });

      const removedUnwantedRelations = await removeUnwantedRelations();
      const createdNewRelations = await createNewRelations();

      const explorationPointRelationsUpdated =
        await prisma.explorationPointPreviousRelation.findMany({
          where: { nextPointId: explorationPointUpdated.id },
        });

      return res.json({
        ...explorationPointUpdated,
        relations: explorationPointRelationsUpdated,
      });
    } catch (error) {
      return res.json(error);
    }
  },

  async DeleteExplorationPoint(req, res) {
    const { explorationPointId } = req.params;

    try {
      const explorationPoint = await prisma.explorationPoint.findUnique({
        where: { id: parseInt(explorationPointId) },
      });

      if (!explorationPoint) {
        return res.json({ message: "Ponto de Exploração inexistente" });
      }

      await prisma.explorationPointPreviousRelation.deleteMany({
        where: {
          OR: [
            { previousPointId: parseInt(explorationPointId) },
            { nextPointId: parseInt(explorationPointId) },
          ],
        },
      });

      const explorationPoints = await prisma.explorationPoint.delete({
        where: { id: parseInt(explorationPointId) },
      });

      return res.json({ message: "Ponto de Exploração deletado com sucesso" });
    } catch (error) {
      return res.json(error);
    }
  },
};
