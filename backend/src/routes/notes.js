import { Router } from "express";
import { prisma } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import {
  generateAndStoreEmbedding,
  removeEmbedding,
  searchNotes
} from "../services/aiService.js";

const router = Router();

// Used for normalization since Prisma already maps snake_case correctly via schema
function mapNote(note) {
  return {
    id: Number(note.id),
    title: note.title,
    content: note.content || "",
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    userId: Number(note.userId)
  };
}

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.session.user.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json(notes.map(mapNote));
  } catch (error) {
    next(error);
  }
});

router.get("/search", async (req, res, next) => {
  const query = req.query?.query?.toString().trim();
  if (!query) {
    res.json([]);
    return;
  }

  try {
    const notesResult = await prisma.note.findMany({
      where: { userId: req.session.user.id },
      orderBy: { createdAt: 'asc' }
    });

    const notes = notesResult.map(mapNote);
    res.json(await searchNotes(query, notes));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const note = await prisma.note.findFirst({
      where: { 
        id: Number(req.params.id),
        userId: req.session.user.id 
      }
    });

    if (!note) {
      res.status(404).end();
      return;
    }

    res.json(mapNote(note));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const title = req.body?.title?.trim();
  const content = req.body?.content?.toString() || "";

  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.session.user.id
      }
    });

    const note = mapNote(newNote);
    await generateAndStoreEmbedding(note);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const title = req.body?.title?.trim();
  const content = req.body?.content?.toString() || "";

  if (!title) {
    res.status(400).json({ message: "Title is required" });
    return;
  }

  try {
    // We updateMany to safely enforce the userId filter condition
    const updateResult = await prisma.note.updateMany({
      where: {
        id: Number(req.params.id),
        userId: req.session.user.id
      },
      data: {
        title,
        content,
        updatedAt: new Date()
      }
    });

    if (updateResult.count === 0) {
      res.status(404).end();
      return;
    }

    // Fetch the updated note
    const updatedNote = await prisma.note.findFirst({
      where: { id: Number(req.params.id) }
    });

    const note = mapNote(updatedNote);
    await generateAndStoreEmbedding(note);
    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteResult = await prisma.note.deleteMany({
      where: {
        id: Number(req.params.id),
        userId: req.session.user.id
      }
    });

    if (deleteResult.count === 0) {
      res.status(404).end();
      return;
    }

    removeEmbedding(Number(req.params.id));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
