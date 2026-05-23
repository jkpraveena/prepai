import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Lazy-initialized Google GenAI client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please verify it in Settings > Secrets or the env configuration.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PrepAI API Server is healthy and responsive." });
});

// Endpoint: Generate Interview Question
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    if (!topic || !difficulty) {
      return res.status(400).json({ error: "Missing required parameters: topic and difficulty are required." });
    }

    const ai = getGeminiClient();

    const systemPrompt = "You are 'PrepAI Model-3', a senior tech interviewer and educational study mentor. Your tone is supportive, high-caliber, and constructive.";
    const userPrompt = `Generate a realistic tech mock interview question.
Topic: ${topic}
Difficulty: ${difficulty}

Guidelines:
- Provide a challenging, realistic question. If the topic is technical (like JavaScript, Python, DSA, AI/ML), ask for coding logic, concepts, code critiques, or algorithm scenarios. If it is "HR Interview", ask standard behavioral or cultural questions (e.g., about leadership, handling conflict, or project failures).
- Provide a helpful, constructive hint that points to key keywords or structure without giving the complete solution away immediately.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The targeted mock interview question itself."
            },
            hint: {
              type: Type.STRING,
              description: "A friendly, expert hint or directional pointer to guide the user under pressure."
            }
          },
          required: ["question", "hint"]
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("No response received from Gemini API.");
    }

    const result = JSON.parse(bodyText.trim());
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/generate endpoint:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while generating the interview question."
    });
  }
});

// Endpoint: Evaluate Answer
app.post("/api/gemini/evaluate", async (req, res) => {
  try {
    const { topic, difficulty, question, userAnswer } = req.body;
    if (!topic || !difficulty || !question || userAnswer === undefined) {
      return res.status(400).json({
        error: "Missing required parameters: topic, difficulty, question, and userAnswer are required."
      });
    }

    const ai = getGeminiClient();

    const systemPrompt = "You are 'PrepAI Model-3 Evaluation Engine', a friendly, rigorous, and highly encouraging technical recruiter and expert study mentor. You grade answers constructly out of 10, recognizing partial knowledge and providing clear pathways to improve.";
    const userPrompt = `Please evaluate this candidate's response to the interview question below:

Topic: ${topic}
Difficulty: ${difficulty}
Question: ${question}
Candidate's User Answer: ${userAnswer}

Evaluation guidelines:
- Score: Return an integer from 1 (poor/no answer/skip) to 10 (exceptionally detailed senior level). If they skipped the question or typed gibberish, grade them strictly but kindly (e.g. 1-2 score) and output constructive steps to learn the topic.
- Strengths: Highlight 2 or 3 distinct components they answered correctly or identified.
- Improvements: Highlight 2 or 3 technical gaps or nuances they missed.
- Better Answer: Write a polished, premium reference response (explain like a senior engineer, including clean well-documented code or bullet points if appropriate).
- Feedback: Provide direct, encouraging mentor feedback to motivate them for their next revision.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "An evaluation score from 1 to 10."
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2 to 3 strengths identified in their candidate answer."
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2 to 3 gaps or concrete areas of improvement."
            },
            betterAnswer: {
              type: Type.STRING,
              description: "A production-grade, premium reference answer (supporting code or markdown)."
            },
            feedback: {
              type: Type.STRING,
              description: "Warm, professional, mentoring feedback summarizing their progress."
            }
          },
          required: ["score", "strengths", "improvements", "betterAnswer", "feedback"]
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("No response received from evaluation engine.");
    }

    const result = JSON.parse(bodyText.trim());
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/gemini/evaluate endpoint:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while evaluating the response."
    });
  }
});

// Setup Vite Dev server / Serve build
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static bundle from 'dist' in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PrepAI server is active at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start PrepAI express server:", err);
});
