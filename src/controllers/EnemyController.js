import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export default {

    async CreateEnemy(req, res) {
        const { name } = req.body;

        try {
            const newEnemy = await prisma.enemy.create({ data: { name } });

            return res.json(newEnemy);
        } catch (error) {
            return res.json({ message: error.message });
        }
    },

    async FindAllEnemies(req, res) {
        try {
            const enemies = await prisma.enemy.findMany();
            return res.json(enemies);
        } catch (error) {
            return res.json(error);
        }
    },

    async FindOneEnemy(req, res) {
        const { enemyId } = req.params;

        try {
            const enemy = await prisma.enemy.findUnique({ where: { id: Number(enemyId) } });

            if (!enemy) {
                return res.json({ message: "Inimigo inexistente" });
            }

            return res.json(enemy);
        } catch (error) {
            return res.json(error);
        }
    },


    async UpdateEnemy(req, res) {
        const { enemyId } = req.params;
        const { name } = req.body;

        try {
            const enemy = await prisma.enemy.findUnique({ where: { id: Number(enemyId) } });

            if (!enemy) {
                return res.json({ message: "Inimigo inexistente" });
            }

            const updatedEnemy = await prisma.enemy.update({ where: { id: Number(enemyId) }, data: { name } });


            return res.json(updatedEnemy);
        } catch (error) {
            return res.json(error);
        }
    },


    async DeleteEnemy(req, res) {
        const { enemyId } = req.params;

        try {
            const enemy = await prisma.enemy.findUnique({ where: { id: Number(enemyId) } });

            if (!enemy) {
                return res.json({ message: "Inimigo inexistente" });
            }

            const deletedEnemy = await prisma.enemy.delete({ where: { id: Number(enemyId) } });


            return res.json(deletedEnemy);
        } catch (error) {
            return res.json(error);
        }
    },

}
