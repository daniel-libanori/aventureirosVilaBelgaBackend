import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  async CreateBook(req, res) {
    const { name } = req.body;
    const { userId } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

      if (!user) {
        return res.json({ message: "Usuario inexistente" });
      }

      const books = await prisma.book.create({
        data: {
          name,
          userId: user.id,
        },
        include: {
          author: true,
        },
      });

      return res.json(books);
    } catch (error) {
      return res.json({ message: error.message });
    }
  },

  async FindAllBooks(req, res) {
    const { userId } = req.params;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

      if (!user) {
        return res.json({ message: "Usuario inexistente" });
      }

      // const books = await prisma.book.findMany({ where: { userId: Number(user.id) } });

      // return res.json(books);


    const books = await prisma.book.findMany({
      where: { userId: Number(user.id) },
      include: {
        chapters: {
          select: {
            id: true // Você pode selecionar outros campos que desejar aqui
          }
        }
      }
    });

    // Adicione a contagem de chapters em cada book
    const booksWithChapterCount = books.map((book) => ({
      ...book,
      chapterCount: book.chapters.length
    }));

    return res.json(booksWithChapterCount);
    } catch (error) {
      return res.json(error);
    }
  },

  async FindOneBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });
      if (!book) {
        return res.json({ message: "Livro inexistente" });
      }

      return res.json(book);
    } catch (error) {
      return res.json(error);
    }
  },

  async UpdateBook(req, res) {
    const { bookId } = req.params;
    const { name } = req.body;

    try {
      const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });

      if (!book) {
        return res.json({ message: "Livro inexistente" });
      }
      
      const books = await prisma.book.update({ 
          where: { id: Number(bookId) } ,
          data:  { name }
      });

      return res.json(books);
    } catch (error) {
      return res.json(error);
    }
  },

  async DeleteBook(req, res) {
    const { bookId } = req.params;

    try {
      const book = await prisma.book.findUnique({ where: { id: Number(bookId) } });

      if (!book) {
        return res.json({ message: "Livro inexistente" });
      }
      
      const books = await prisma.book.delete({ 
          where: { id: Number(bookId) }
      });


      return res.json(books);
    } catch (error) {
      return res.json(error);
    }
  },
};
