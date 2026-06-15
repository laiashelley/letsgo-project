import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in .env file');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'venga-backend' });
});

/**
 * Sanitize LLM response to extract clean JSON array
 * Handles markdown fences, extra whitespace, and malformed responses
 */
function sanitizeResponse(rawText) {
  let text = rawText.trim();

  // Remove markdown code fences (```json, ```javascript, etc.)
  text = text.replace(/```(?:json|javascript|js)?\n?/g, '').trim();

  // Try to extract JSON array if wrapped in other text
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    text = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
      return parsed;
    }
    throw new Error('Not a valid array of strings');
  } catch (error) {
    throw new Error(`Failed to parse LLM response as JSON array: ${error.message}`);
  }
}

/**
 * Strict prompt for task decomposition (Spanish)
 */
const BREAKDOWN_SYSTEM_PROMPT = `Actúa como un desglosador de tareas optimizado para TDAH severo.
Tu objetivo es coger una tarea abstracta y romperla en pasos tan ridículamente pequeños y específicos que requieran cero esfuerzo mental para empezar.

Reglas estrictas:
1. Máximo 5 pasos.
2. Cada paso debe ser una acción física o cognitiva ejecutable en menos de 5 minutos.
3. No uses lenguaje motivacional ni consejos redundantes. Va directo a la acción.
4. El primer paso debe ser absurdamente fácil (ej: "Abre el editor de código", "Levántate y coge una bayeta").

Formato de salida: Devuelve EXCLUSIVAMENTE un array JSON plano de strings, sin Markdown, sin bloques de código, solo el JSON.`;

/**
 * POST /api/un-jira/v1/breakdown
 * Accepts a task and returns a decomposed list of atomic steps
 */
app.post('/api/un-jira/v1/breakdown', async (req, res) => {
  const { task } = req.body;

  if (!task || typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({
      error: 'Invalid request. Provide a "task" field with a non-empty string.',
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${BREAKDOWN_SYSTEM_PROMPT}\n\nTarea a descomponer: "${task.trim()}"`,
            },
          ],
        },
      ],
    });

    const rawResponse = result.response.text();
    const steps = sanitizeResponse(rawResponse);

    res.json({ steps });
  } catch (error) {
    console.error('Error in /breakdown endpoint:', error);
    res.status(502).json({
      error: 'Failed to process task breakdown',
      details: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Venga backend running on http://localhost:${PORT}`);
  console.log(`POST /api/un-jira/v1/breakdown — Task decomposition endpoint`);
});
