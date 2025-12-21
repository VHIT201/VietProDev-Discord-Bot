import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const ANSANG_COMMAND = { name: 'ansang', description: 'Gợi ý món ăn sáng', type: 1 };
const ANTRUA_COMMAND = { name: 'antrua', description: 'Gợi ý món ăn trưa', type: 1 };
const UONGGI_COMMAND = { name: 'uonggi', description: 'Gợi ý đồ uống', type: 1 };

const TEMP_COMMAND = {
  name: 'temp',
  description: 'Hiện nhiệt độ (mặc định Biên Hòa)',
  options: [
    {
      type: 3,
      name: 'city',
      description: 'Tên thành phố (tuỳ chọn)',
      required: false,
      // allow autocomplete
      autocomplete: true,
    },
  ],
  type: 1,
};

const MYNAME_COMMAND = { name: 'myname', description: 'Hiển thị tên người gọi', type: 1 };

const ALL_COMMANDS = [
  TEST_COMMAND,
  CHALLENGE_COMMAND,
  ANSANG_COMMAND,
  ANTRUA_COMMAND,
  UONGGI_COMMAND,
  TEMP_COMMAND,
  MYNAME_COMMAND,
];

// Use guild registration if GUILD_ID present (instant), otherwise register global commands
InstallCommands(process.env.APP_ID, ALL_COMMANDS, process.env.GUILD_ID);
