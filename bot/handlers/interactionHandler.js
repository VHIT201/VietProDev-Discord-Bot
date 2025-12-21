import {
  InteractionResponseType,
  InteractionResponseFlags,
  InteractionType,
  MessageComponentTypes,
} from 'discord-interactions';
import { getRandomEmoji } from '../../utils.js';
import { getShuffledOptions, getResult } from '../../game.js';

export async function handleInteraction(req, res) {
  const { id, type, data } = req.body;

  // Handle PING
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // Handle application commands
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'test') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `hello world ${getRandomEmoji()}`,
            },
          ],
        },
      });
    }

    // Challenge command handled by game logic
    if (name === 'challenge') {
      // This command requires options; return a simple acknowledgement for now
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: 'Challenge command received.' },
      });
    }

    // quick suggestion commands registered as slash commands
    if (name === 'ansang') {
      const breakfast = ['Phở bò','Bún riêu','Bánh mì ốp la','Xôi gà','Bánh cuốn','Cháo sườn','Hủ tiếu','Bún chả','Mì xào'];
      const pick = breakfast[Math.floor(Math.random() * breakfast.length)];
      return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: `Gợi ý ăn sáng: ${pick}` } });
    }

    if (name === 'antrua') {
      const lunch = ['Cơm gà','Cơm sườn','Bún mắm','Cơm tấm','Phở','Mì quảng','Bún bò Huế','Cơm gà xối mỡ','Canh chua + cá chiên'];
      const pick = lunch[Math.floor(Math.random() * lunch.length)];
      return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: `Gợi ý ăn trưa: ${pick}` } });
    }

    if (name === 'uonggi') {
      const drinks = ['Trà đá','Trà sữa trân châu','Cà phê sữa','Sinh tố bơ','Nước mía','Nước chanh leo','Soda chanh','Matcha latte','Sữa đậu nành'];
      const pick = drinks[Math.floor(Math.random() * drinks.length)];
      return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: `Gợi ý đồ uống: ${pick}` } });
    }

    if (name === 'temp') {
      const city = (data.options && data.options[0] && data.options[0].value) || 'Biên Hòa';
      try {
        const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
        const resFetch = await fetch(url, { headers: { 'User-Agent': 'discord-example-app' } });
        const text = await resFetch.text();
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: text } });
      } catch (err) {
        console.error('Error fetching temp for slash', err);
        return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: 'Không lấy được dữ liệu thời tiết.' } });
      }
    }

    if (name === 'myname') {
      const userName = req.body.member?.user?.username || req.body.member?.user?.tag || 'người dùng';
      return res.send({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: `${userName}` } });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  // Handle autocomplete interactions for command options
  if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    try {
      const { name, options } = data;
      // find the focused option
      const focused = (options || []).find((o) => o.focused);
      const value = focused ? (focused.value || '') : '';

      // For the temp command suggest some city names
      if (name === 'temp' && focused && focused.name === 'city') {
        const cities = ['Biên Hòa','Hà Nội','Hồ Chí Minh','Đà Nẵng','Nha Trang','Huế','Cần Thơ','Vũng Tàu','Bắc Ninh'];
        const filtered = cities
          .filter((c) => c.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 25)
          .map((c) => ({ name: c, value: c }));

        return res.send({ type: 8, data: { choices: filtered } });
      }

      // default empty choices
      return res.send({ type: 8, data: { choices: [] } });
    } catch (err) {
      console.error('Error handling autocomplete', err);
      return res.send({ type: 8, data: { choices: [] } });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
}
