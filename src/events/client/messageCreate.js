const Logger = require('../../utils/logger');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Bỏ qua bot
        if (!message || !message.author || message.author.bot) return;
        
        const text = (message.content || '').trim().toLowerCase();
        
        try {
            // Legacy text commands (giữ lại để tương thích)
            
            // !temp - Thời tiết
            if (text === '!temp' || text.startsWith('!temp ')) {
                const city = 'Biên Hòa';
                const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
                const res = await fetch(url, { headers: { 'User-Agent': 'VietProDev-Bot' } });
                
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const body = await res.text();
                await message.reply(body);
                return;
            }
            
            // !ansang - Gợi ý ăn sáng
            if (text === '!ansang') {
                const breakfast = ['Phở bò','Bún riêu','Bánh mì ốp la','Xôi gà','Bánh cuốn','Cháo sườn','Hủ tiếu','Bún chả','Mì xào'];
                const pick = breakfast[Math.floor(Math.random() * breakfast.length)];
                await message.reply(`🍜 Gợi ý ăn sáng: **${pick}**`);
                return;
            }
            
            // !antrua - Gợi ý ăn trưa
            if (text === '!antrua') {
                const lunch = ['Cơm gà','Cơm sườn','Bún mắm','Cơm tấm','Phở','Mì quảng','Bún bò Huế','Cơm gà xối mỡ','Canh chua + cá chiên'];
                const pick = lunch[Math.floor(Math.random() * lunch.length)];
                await message.reply(`🍚 Gợi ý ăn trưa: **${pick}**`);
                return;
            }
            
            // !uonggi - Gợi ý đồ uống
            if (text === '!uonggi') {
                const drinks = ['Trà đá','Trà sữa trân châu','Cà phê sữa','Sinh tố bơ','Nước mía','Nước chanh leo','Soda chanh','Matcha latte','Sữa đậu nành'];
                const pick = drinks[Math.floor(Math.random() * drinks.length)];
                await message.reply(`🥤 Gợi ý đồ uống: **${pick}**`);
                return;
            }
            
        } catch (error) {
            Logger.error('Lỗi trong messageCreate handler', error);
        }
    }
};
