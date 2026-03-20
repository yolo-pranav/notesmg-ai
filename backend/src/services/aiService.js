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

  for (let index = 0; index < vectorA.length; index += 1) {
    dotProduct += vectorA[index] * vectorB[index];
  }

  return dotProduct;
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
    let semanticScore = 0;
    
    if (queryVector.length > 0 && vectorIndex.has(Number(note.id))) {
      const noteVector = vectorIndex.get(Number(note.id));
      semanticScore = cosineSimilarity(queryVector, noteVector);
    }
    
    let keywordScore = 0;
    
    // Only apply keyword bumps if query is meaningful (>= 3 chars) to avoid 
    // short/single-letter searches artificially boosting totally irrelevant notes
    if (normalizedQuery.length >= 3) {
      const lowerTitle = note.title.toLowerCase();
      const lowerContent = (note.content || "").toLowerCase();
      
      if (lowerTitle.includes(normalizedQuery)) {
        keywordScore += 0.5; // Exact title substring match is highly relevant
      } else if (lowerContent.includes(normalizedQuery)) {
        keywordScore += 0.25; // Content wording substring match is moderately relevant
      }
    }

    return { 
      note, 
      score: semanticScore + keywordScore,
      semanticScore 
    };
  });

  const processedNotes = scoredNotes
    // STRICT THRESHOLD:
    // Models like all-MiniLM-L6-v2 often assign 0.15-0.25 scores to completely 
    // unrelated texts. Raising this to 0.40 guarantees we only present items 
    // with strong semantic ties OR a definitive exact text match bypass.
    .filter((entry) => entry.score >= 0.40)
    // Primary sorting: Highest aggregate score first
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Limit to top 10 best matches

  // Log results title and score in backend console to help dev debugging
  console.log(`\n--- AI Search Results for: "${query}" ---`);
  if (processedNotes.length === 0) {
    console.log("No relevant notes found.");
  } else {
    processedNotes.forEach((entry, idx) => {
      console.log(`[#${idx + 1}] Score: ${entry.score.toFixed(4)} (Semantic: ${entry.semanticScore.toFixed(4)}) | Title: "${entry.note.title}"`);
    });
  }

  return processedNotes.map((entry) => entry.note);
}
