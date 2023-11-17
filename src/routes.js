import { Router } from "express";

import UserController from "./controllers/UserController.js";
import BookController from "./controllers/BookController.js";
import ChapterController from "./controllers/ChapterController.js";
import MapController from "./controllers/MapController.js";
import ExplorationPointController from "./controllers/ExplorationPointController.js";
import PdfController from "./controllers/PdfController.js";
import EnemyController from "./controllers/EnemyController.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/user", UserController.CreateUser);
router.get("/users" ,UserController.FindAllUsers);
router.get("/user/:email", UserController.FindUser);
router.put("/user/:userId", UserController.UpdateUser);
router.delete("/user/:userId", UserController.DeleteUser);

router.post("/user/:userId/book", BookController.CreateBook);
router.get("/user/:userId/books", BookController.FindAllBooks);
router.get("/book/:bookId", BookController.FindOneBook);
router.put("/book/:bookId", BookController.UpdateBook);
router.delete("/book/:bookId", BookController.DeleteBook);


router.post("/book/:bookId/chapter", ChapterController.CreateChapter);
router.get("/book/:bookId/chapters", ChapterController.FindAllChapters);
router.get("/chapter/:chapterId", ChapterController.FindOneChapter);
router.put("/chapter/:chapterId", ChapterController.UpdateChapter);
router.delete("/chapter/:chapterId", ChapterController.DeleteChapter);

router.post("/map", MapController.CreateMap);
router.get("/maps", MapController.FindAllMaps);
router.get("/map/:mapId", MapController.FindOneMap);
router.put("/map/:mapId", MapController.UpdateMap);
router.delete("/map/:mapId", MapController.DeleteMap);

router.post("/chapter/:chapterId/explorationPoint", ExplorationPointController.CreateExplorationPoint);
router.get("/chapter/:chapterId/explorationPoints", ExplorationPointController.FindAllExplorationPoints);
router.get("/explorationPoint/:explorationPointId", ExplorationPointController.FindOneExplorationPoint);
router.put("/explorationPoint/:explorationPointId", ExplorationPointController.UpdateExplorationPoint);
router.delete("/explorationPoint/:explorationPointId", ExplorationPointController.DeleteExplorationPoint);

router.get("/book/:bookId/pdf", PdfController.CreateBookPdf)

router.post('/enemy', EnemyController.CreateEnemy);
router.get('/enemies', EnemyController.FindAllEnemies);
router.get('/enemy/:enemyId', EnemyController.FindOneEnemy);
router.put('/enemy/:enemyId', EnemyController.UpdateEnemy);
router.delete('/enemy/:enemyId', EnemyController.DeleteEnemy);

export { router };
