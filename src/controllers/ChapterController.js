import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  async CreateChapter(req, res) {
    const { bookId } = req.params;
    const { name, introduction, mapId } = req.body;

    try {
      const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });

      if (!book) {
        return res.json({ message: "Livro inexistente" });
      }

      const chapters = await prisma.chapter.create({
        data: {
          name,
          bookId: book.id,
          introduction,
          mapId
        },
        include: {
          book: true,
          map: true
        },
      });

      return res.json(chapters);
    } catch (error) {
      return res.json({ message: error.message });
    }
  },

  async FindAllChapters(req, res) {
    const { bookId } = req.params;

    try {
      const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });

      if (!book) {
        return res.json({ message: "Usuario inexistente" });
      }

      const chapters = await prisma.chapter.findMany({ where: { bookId: Number(book.id) } });
      return res.json(chapters);
    } catch (error) {
      return res.json(error);
    }
  },

  async FindOneChapter(req, res) {
    const { chapterId } = req.params;

    try {
      const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }

      return res.json(chapter);
    } catch (error) {
      return res.json(error);
    }
  },

  async UpdateChapter(req, res) {
    const { chapterId } = req.params;
    const { name, introduction, bookId, mapId } = req.body;

    try {
      const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });
      
      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }

      const chapters = await prisma.chapter.update({ 
          where: { id: Number(chapterId) } ,
          data:  { name, introduction}
      });

      

      return res.json(chapters);
    } catch (error) {
      console.log(error)
      return res.json(error);
    }
  },

  async DeleteChapter(req, res) {
    const { chapterId } = req.params;

    try {
      const chapter = await prisma.chapter.findUnique({ where: { id: Number(chapterId) } });

      if (!chapter) {
        return res.json({ message: "Capítulo inexistente" });
      }
      
      const explorationPoints = await prisma.explorationPoint.findMany({ where: { chapterId: Number(chapterId) } });


      const deleteOperationsExpPoint = explorationPoints.map(async (explorationPoint) => {
        await prisma.explorationPointPreviousRelation.deleteMany({
          where: { 
            OR: [
              {previousPointId: parseInt(explorationPoint.id)},
              {nextPointId: parseInt(explorationPoint.id)}
            ]
          },
        });
      
        const explorationPointsDeleted = await prisma.explorationPoint.delete({ 
          where: { id: parseInt(explorationPoint.id) }
        });
      });
      
      await Promise.all(deleteOperationsExpPoint);

      const chapters = await prisma.chapter.delete({ 
          where: { id: Number(chapterId) }
      });

      return res.json(chapters);
    } catch (error) {
      return res.json(error);
    }
  },
};
