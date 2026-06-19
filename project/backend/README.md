# Let's Go Backend

Express.js proxy server that interfaces with the Gemini API to decompose tasks into atomic steps.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

Get your API key at: https://ai.google.dev/

## Run

```bash
npm start
```

Or with hot-reload (requires nodemon):
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{ "status": "ok", "service": "letsgo-backend" }
```

### POST /api/letsgo/v1/breakdown
Decomposes a task into atomic steps.

**Request:**
```json
{ "task": "Clean my messy desk" }
```

**Response (success):**
```json
{
  "steps": [
    "Recoge las tazas sucias y déjalas en la cocina.",
    "Tira los papeles acumulados a la basura.",
    "Pasa un trapo húmedo por la superficie.",
    "Coloca el teclado y el ratón en su sitio."
  ]
}
```

**Response (error):**
```json
{
  "error": "Failed to process task breakdown",
  "details": "..."
}
```

## Environment Variables

- `GEMINI_API_KEY` (required): Google Generative AI API key
- `PORT` (optional): Server port (default: 3000)

## Testing with curl

```bash
curl -X POST http://localhost:3000/api/letsgo/v1/breakdown \
  -H "Content-Type: application/json" \
  -d '{"task":"Write a blog post about ADHD"}'
```
