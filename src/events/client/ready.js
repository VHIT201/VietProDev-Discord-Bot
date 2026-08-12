const Logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/247.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        Logger.success(`Bot đã online: ${client.user.tag}`);
        Logger.info(`Đang phục vụ ${client.guilds.cache.size} servers với ${client.users.cache.size} users`);
        
        // Set bot activity
        client.user.setPresence({
            activities: [{ name: 'Đại K Biên Hòa', type: 3 }], // Type 3 = Watching
            status: 'online'
        });

        // Auto-join 24/7 channels
        try {
            if (fs.existsSync(dataFile)) {
                const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
                for (const [guildId, config] of Object.entries(data)) {
                    if (!config.enabled) continue;
                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) continue;
                    const channel = guild.channels.cache.get(config.channelId);
                    if (!channel) continue;
                    setTimeout(async () => {
                        try {
                            await channel.join();
                            Logger.success(`[247] Bot đã join channel ${channel.name} (guild ${guildId})`);
                        } catch (e) {
                            Logger.error(`[247] Không thể join channel: ${e.message}`);
                        }
                    }, 3000);
                }
            }
        } catch (e) {
            Logger.error('[247] Lỗi đọc config 24/7:', e);
        }
    }
};
