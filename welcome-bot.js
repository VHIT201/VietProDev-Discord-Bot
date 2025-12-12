import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerWelcomeHandler } from './bot/handlers/welcomeHandler.js';
import { registerMessageHandlers } from './bot/handlers/messageHandler.js';

const token = process.env.DISCORD_TOKEN;
const channelId = process.env.WELCOME_CHANNEL_ID;
const messageTemplate = process.env.WELCOME_MESSAGE || 'Chào mừng {user} đến với server!';

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Welcome bot logged in as ${client.user.tag}`);
  // register handlers after client is ready
  registerMessageHandlers(client);
  registerWelcomeHandler(client, channelId, messageTemplate);
});

client.login(token).catch((err) => {
  console.error('Failed to login bot:', err);
  process.exit(1);
});
