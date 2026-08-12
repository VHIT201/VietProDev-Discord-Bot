const Logger = require('../../utils/logger');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/247.json');

function load247Data() {
    try {
        if (fs.existsSync(dataFile)) {
            return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        }
    } catch (e) {}
    return {};
}

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        const client = newState.client;

        // Chỉ quan tâm khi bot bị thay đổi voice state
        if (newState.id !== client.user.id) return;

        const data = load247Data();
        const guildId = newState.guild.id;
        const config = data[guildId];

        if (!config || !config.enabled) return;

        // Bot bị disconnect (không còn ở channel nào)
        if (!newState.channelId) {
            Logger.info(`[247] Bot bị disconnect khỏi guild ${guildId}, tự join lại sau 5s...`);
            setTimeout(async () => {
                try {
                    const guild = client.guilds.cache.get(guildId);
                    if (!guild) return;
                    const channel = guild.channels.cache.get(config.channelId);
                    if (!channel) {
                        Logger.warn(`[247] Channel ${config.channelId} không tồn tại, tắt 24/7`);
                        delete data[guildId];
                        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
                        return;
                    }
                    await channel.join();
                    Logger.success(`[247] Bot đã join lại channel ${channel.name}`);
                } catch (e) {
                    Logger.error(`[247] Không thể join lại: ${e.message}`);
                }
            }, 5000);
        }
    },
};
