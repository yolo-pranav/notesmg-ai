import { pipeline } from "@xenova/transformers";
import { prisma } from "../config/db.js";

const vectorIndex = new Map();

let extractorPromise = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return extractorPromise;
}

function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB) || vectorA.length !== vectorB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    dotProduct += vectorA[index] * vectorB[index];
    normA += vectorA[index] ** 2;
    normB += vectorB[index] ** 2;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

async function fetchEmbedding(text) {
  if (!text || text.trim() === "") {
    return [];
  }

  try {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    
    return Array.from(output.data);
  } catch (error) {
    console.error("Local AI Model Error", error.message);
    return [];
  }
}

export async function generateAndStoreEmbedding(note) {
  const embedding = await fetchEmbedding(`${note.title} ${note.content}`);
  if (embedding.length > 0) {
    vectorIndex.set(Number(note.id), embedding);
  }
}

export function removeEmbedding(noteId) {
  vectorIndex.delete(Number(noteId));
}

export async function initializeEmbeddings() {
  const notes = await prisma.note.findMany({
    orderBy: { id: 'asc' }
  });

  for (const note of notes) {
    await generateAndStoreEmbedding({
      id: Number(note.id),
      title: note.title,
      content: note.content || ""
    });
  }
}

export async function searchNotes(query, notes) {
  if (!query || query.trim() === "") return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryVector = await fetchEmbedding(query);

  const scoredNotes = notes.map((note) => {
    let score = 0;
    
    if (queryVector.length > 0 && vectorIndex.has(Number(note.id))) {
      const noteVector = vectorIndex.get(Number(note.id));
      score = cosineSimilarity(queryVector, noteVector);
    }
    
    // Exact word matching massive boosts
    const titleMatch = note.title.toLowerCase().includes(normalizedQuery);
    const contentMatch = note.content && note.content.toLowerCase().includes(normalizedQuery);
    
    if (titleMatch) {
      score += 0.5; // Exact title match is highly relevant
    } else if (contentMatch) {
      score += 0.3; // Content wording match is moderately relevant
    }

    return { note, score };
  });

  const processedNotes = scoredNotes
    // Strictly threshold (prevent irrelevant nonsense results)
    .filter((entry) => entry.score >= 0.25)
    // Primary sorting: Highest Score First (Most Relevant -> Least Relevant)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Limit to top 10 best matches

  // Log results title and score in backend console
  console.log(`\n--- AI Search Results for: "${query}" ---`);
  if (processedNotes.length === 0) {
    console.log("No relevant notes found.");
  } else {
    processedNotes.forEach((entry, idx) => {
      console.log(`[#${idx + 1}] Score: ${entry.score.toFixed(4)} | Title: "${entry.note.title}"`);
    });
  }

  return processedNotes.map((entry) => entry.note);
}
