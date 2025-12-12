export function registerMessageHandlers(client) {
  client.on('messageCreate', async (message) => {
    try {
      if (!message || !message.author || message.author.bot) return;

      const text = (message.content || '').trim().toLowerCase();
      if (text === 'hello') {
        await message.reply('hello cái gì');
        return;
      }

      const nameQueries = ['what your name', "what's your name", 'what is your name'];
      if (nameQueries.includes(text)) {
        await message.reply(`${message.author.username}`);
        return;
      }

      if (text === '!temp' || text.startsWith('!temp ')) {
        try {
          const city = 'Biên Hòa';
          const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
          const res = await fetch(url, { headers: { 'User-Agent': 'discord-example-app' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const body = await res.text();
          await message.reply(body);
        } catch (err) {
          console.error('Error fetching temperature', err);
          await message.reply('Không lấy được dữ liệu thời tiết ngay bây giờ.');
        }
        return;
      }

      if (text === '!ansang') {
        const breakfast = ['Phở bò','Bún riêu','Bánh mì ốp la','Xôi gà','Bánh cuốn','Cháo sườn','Hủ tiếu','Bún chả','Mì xào'];
        const pick = breakfast[Math.floor(Math.random() * breakfast.length)];
        await message.reply(`Gợi ý ăn sáng: ${pick}`);
        return;
      }

      if (text === '!antrua') {
        const lunch = ['Cơm gà','Cơm sườn','Bún mắm','Cơm tấm','Phở','Mì quảng','Bún bò Huế','Cơm gà xối mỡ','Canh chua + cá chiên'];
        const pick = lunch[Math.floor(Math.random() * lunch.length)];
        await message.reply(`Gợi ý ăn trưa: ${pick}`);
        return;
      }

      if (text === '!uonggi') {
        const drinks = ['Trà đá','Trà sữa trân châu','Cà phê sữa','Sinh tố bơ','Nước mía','Nước chanh leo','Soda chanh','Matcha latte','Sữa đậu nành'];
        const pick = drinks[Math.floor(Math.random() * drinks.length)];
        await message.reply(`Gợi ý đồ uống: ${pick}`);
        return;
      }

    } catch (err) {
      console.error('Error in messageCreate handler', err);
    }
  });
}
