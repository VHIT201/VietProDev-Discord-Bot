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
const cron = require('node-cron');
const {
    createMorningReminder,
    createWaterReminder,
    createLunchReminder,
    createEveningReminder
} = require('./services/reminderService');
const { createKazagumo } = require('./services/musicService');
const Logger = require('./utils/logger');

// 1. Khởi tạo Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// 2. Tạo Collection
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

        client.once('ready', () => {
            // Khởi tạo Kazagumo (Lavalink client) nếu có cấu hình
            if (process.env.LAVALINK_HOST || process.env.LAVALINK_PORT) {
                try {
                    createKazagumo(client);
                    Logger.info('Đang kết nối Lavalink...');
                } catch (err) {
                    Logger.error('Không thể khởi tạo Kazagumo:', err);
                }
            } else {
                Logger.warn('Không có cấu hình Lavalink, tính năng nhạc sẽ không khả dụng');
            }

            const sendReminder = async (reminderFn, timeStr) => {
                try {
                    const channel = client.channels.cache.get(process.env.GENERAL_CHANNEL_ID);
                    if (!channel) {
                        console.warn(`⚠️ Không tìm thấy channel để gửi nhắc nhở ${timeStr}`);
                        return;
                    }
                    const { embed, content } = reminderFn();
                    await channel.send({ content, embeds: [embed] });
                    console.log(`✅ Đã gửi nhắc nhở ${timeStr}`);
                } catch (error) {
                    console.error(`❌ Lỗi gửi nhắc nhở ${timeStr}:`, error);
                }
            };

            // 7:00 sáng - Chào buổi sáng
            cron.schedule('0 7 * * *', () => sendReminder(createMorningReminder, '7:00 sáng'), {
                timezone: 'Asia/Ho_Chi_Minh'
            });

            // 9:00 - Nhắc uống nước
            cron.schedule('0 9 * * *', () => sendReminder(createWaterReminder, '9:00'), {
                timezone: 'Asia/Ho_Chi_Minh'
            });

            // 11:30 - Chúc ăn trưa
            cron.schedule('30 11 * * *', () => sendReminder(createLunchReminder, '11:30'), {
                timezone: 'Asia/Ho_Chi_Minh'
            });

            // 17:00 - Chúc về cẩn thận
            cron.schedule('0 17 * * *', () => sendReminder(createEveningReminder, '17:00'), {
                timezone: 'Asia/Ho_Chi_Minh'
            });

            console.log('✅ Đã đăng ký 4 cron job nhắc nhở (7:00, 9:00, 11:30, 17:00)');
        });
    } catch (error) {
        console.error('❌ Lỗi khởi động:', error);
    }
})();
