import 'dotenv/config';
import express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { handleInteraction } from './bot/handlers/interactionHandler.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  return handleInteraction(req, res);
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
