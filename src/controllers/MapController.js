import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async CreateMap(req, res) {
    const { name, mapText, mapImageUrl, xMapSize, yMapSize, mapImagebase64 } = req.body;

    try {

      const maps = await prisma.map.create({
        data: {
          name, mapText, mapImageUrl, xMapSize, yMapSize, mapImagebase64
        }
      });

      return res.json(maps);
    } catch (error) {
      return res.json({ message: error.message });
    }
  },

  async FindAllMaps(req, res) {
    try {
      const maps = await prisma.map.findMany();
      return res.json(maps);
    } catch (error) {
      return res.json(error);
    }
  },

  async FindOneMap(req, res) {
    const { mapId } = req.params;

    try {
      const map = await prisma.map.findUnique({ where: { id: Number(mapId) } });

      if (!map) {
        return res.json({ message: "Livro inexistente" });
      }

      return res.json(map);
    } catch (error) {
      return res.json(error);
    }
  },

  async UpdateMap(req, res) {
    const { mapId } = req.params;
    const { name, mapText, mapImageUrl, xMapSize, yMapSize } = req.body;

    try {
      const map = await prisma.map.findUnique({ where: { id: Number(mapId) } });

      if (!map) {
        return res.json({ message: "Mapa inexistente" });
      }
      
      const maps = await prisma.map.update({ 
          where: { id: Number(mapId) } ,
          data:  { name, mapText, mapImageUrl, xMapSize, yMapSize }
      });

      return res.json(maps);
    } catch (error) {
      return res.json(error);
    }
  },

  async DeleteMap(req, res) {
    const { mapId } = req.params;

    try {
      const map = await prisma.map.findUnique({ where: { id: Number(mapId) } });

      if (!map) {
        return res.json({ message: "Capítulo inexistente" });
      }
      
      const maps = await prisma.map.delete({ 
          where: { id: Number(mapId) }
      });

      return res.json(maps);
    } catch (error) {
      return res.json(error);
    }
  },
};
