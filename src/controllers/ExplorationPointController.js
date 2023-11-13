import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  async CreateExplorationPoint(req, res) {
    const { chapterId } = req.params;
    const { name, code, xPosition, yPosition, pointIntroductionText, pointChallangeText, previousExplorationPointsId, nextExplorationPointsId } = req.body;

    try {
      const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }
      const explorationPoints = await prisma.explorationPoint.create({
        data: {
          name, code, xPosition, yPosition, pointIntroductionText, pointChallangeText, chapter: {
            connect: {
              id: Number(chapterId)
            }
          }
        }
      });
      
      if(Array.isArray(previousExplorationPointsId) && previousExplorationPointsId.length > 0){
        const promises = previousExplorationPointsId.map((expId) => {
          return prisma.explorationPointPreviousRelation.create({
            data: {
              previousPointId: expId, 
              nextPointId: explorationPoints.id
            }
          });
        });
      
        const previousExplorationPointsRelation = await Promise.all(promises);
      }
      if(Array.isArray(nextExplorationPointsId)){
        if(!!nextExplorationPointsId.length){
          nextExplorationPointsId.map(async (expId) => {
            const nextExplorationPointsRelation = Promise.all(
              
                

                await prisma.explorationPointPreviousRelation.create({
                  data: {
                    previousPointId: explorationPoints.id, nextPointId: expId
                  }
                })

              
            ) 

          })
        }
        

      }




      return res.json(explorationPoints);
    } catch (error) {
      console.log(error)
      return res.json({ message: error.message });
    }
  },

  async FindAllExplorationPoints(req, res) {
    const { chapterId } = req.params;
    const { getby } = req.query;

    try {
      const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }

      const explorationPoints = await prisma.explorationPoint.findMany({ where: { chapterId: Number(chapterId) } });


      if(getby === 'position'){
        function groupByPosition(array) {
          return array.reduce((result, item) => {
              const key = `${item.xPosition}-${item.yPosition}`;
              (result[key] = result[key] || []).push(item);
              return result;
          }, {});
        }

        return res.json(groupByPosition(explorationPoints));
      }
      
      return res.json(explorationPoints);
    } catch (error) {
      return res.json(error);
    }
  },

  // async FindOneChapter(req, res) {
  //   const { chapterId } = req.params;

  //   try {
  //     const chapter = await prisma.book.findUnique({ where: { id: Number(chapterId) } });

  //     if (!chapter) {
  //       return res.json({ message: "Capítulo inexistente" });
  //     }

  //     return res.json(chapter);
  //   } catch (error) {
  //     return res.json(error);
  //   }
  // },

  // async UpdateChapter(req, res) {
  //   const { chapterId } = req.params;
  //   const { name, introduction, bookId, mapId } = req.body;

  //   try {
  //     const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });

  //     if (!chapter) {
  //       return res.json({ message: "Capítulo inexistente" });
  //     }
      
  //     const chapters = await prisma.chapter.update({ 
  //         where: { id: Number(chapterId) } ,
  //         data:  { name, introduction, bookId, mapId }
  //     });

  //     return res.json(chapters);
  //   } catch (error) {
  //     return res.json(error);
  //   }
  // },

  // async DeleteExplorationPoint(req, res) {
  //   const { explorationPointId } = req.params;

  //   try {
  //     const explorationPoint = await prisma.explorationPoint.findUnique({ where: { id: Number(explorationPointId) } });

  //     if (!explorationPoint) {
  //       return res.json({ message: "Ponto de Exploração inexistente" });
  //     }
      
  //     const explorationPoints = await prisma.explorationPoint.delete({ 
  //         where: { id: Number(explorationPointId) }
  //     });

  //     return res.json(explorationPoints);
  //   } catch (error) {
  //     return res.json(error);
  //   }
  // },
};
