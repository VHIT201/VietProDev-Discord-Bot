require('dotenv').config();

// Ensure global ReadableStream (and related web stream globals) exist for undici
try {
    require('web-streams-polyfill/polyfill');
    console.log('✅ Installed web-streams polyfill');
} catch (e) {
    // If polyfill not available, undici may throw a ReferenceError later
}
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connect } = require('mongoose');
const fs = require('fs');
const path = require('path');

// 1. Khởi tạo Client với quyền hạn đầy đủ cho quản lý công ty
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Cần thiết để đón member mới (Welcome)
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Cần thiết để đọc nội dung chat
        GatewayIntentBits.GuildPresences, // Xem trạng thái online/offline nhân viên
    ]
});

// 2. Tạo Collection để lưu lệnh
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

// 3. Load Handlers
const handlersPath = path.join(__dirname, 'handlers');
const handlers = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

for (const file of handlers) {
    require(`./handlers/${file}`)(client);
}



// 4. Kết nối DB và Login
(async () => {
    try {
        // Kết nối MongoDB (nếu có biến môi trường)
        if (process.env.MONGO_URI) {
            await connect(process.env.MONGO_URI);
            console.log('✅ Đã kết nối MongoDB');
        }
        
        // Login Discord
        await client.login(process.env.DISCORD_TOKEN);
        
        // Debug: Check messageCreate listeners after login
        client.once('ready', () => {
            const messageListeners = client.listeners('messageCreate');
            console.log(`🔍 DEBUG: ${messageListeners.length} messageCreate listener(s) registered`);
            if (messageListeners.length > 1) {
                console.warn('⚠️ WARNING: Multiple messageCreate listeners detected!');
            }
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động:', error);
    }
})();
