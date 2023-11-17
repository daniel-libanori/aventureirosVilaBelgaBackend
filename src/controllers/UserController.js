import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {
  async CreateUser(req, res) {

   
    try {
      const { email } = req.body;
   
      let user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        return res.json({ error: "já existe um usuario com este email" });
      }
      
      const newUser = await prisma.user.create({
        data: {
          email,
        },
      });

      console.log(newUser)

      return res.json(newUser);
    } catch (error) {
      return res.json({ error });
    }
  },

  async FindAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  },

  async FindUser(req, res) {
    const { email } = req.params;
    try {
      const user = await prisma.user.findUnique({ where: { email: String(email) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },

  async UpdateUser(req, res) {
    try {
      const { id } = req.query;
      const { email } = req.body;

      let user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      user = await prisma.user.update({
        where: { id: Number(id) },
        data: { email },
      });

      return res.json(user);
    } catch (error) {
      res.json({ error });
    }
  },

  async DeleteUser(req, res) {
    try {
      const { id } = req.query;

      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user)
        return res.json({ error: "Não possivel encotrar esse usuario" });

      await prisma.user.delete({ where: { id: Number(id) } });

      return res.json({message: "Usuario deletado"});
    } catch (error) {
      return res.json({ error });
    }
  },
};
