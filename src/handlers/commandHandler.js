const { REST, Routes } = require('discord.js');
const { loadFiles } = require('../utils/fileLoader');
const Logger = require('../utils/logger');
const path = require('path');

/**
 * Handler tự động load và đăng ký Slash Commands
 */
module.exports = (client) => {
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    
    // Load tất cả file command
    const commandFiles = loadFiles(commandsPath);
    
    for (const file of commandFiles) {
        try {
            const command = require(file);
            
            if (!command.data || !command.execute) {
                Logger.warn(`File ${file} thiếu property 'data' hoặc 'execute'`);
                continue;
            }
            
            // Lưu vào Collection
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            
            Logger.debug(`Loaded command: ${command.data.name}`);
        } catch (error) {
            Logger.error(`Lỗi khi load command ${file}`, error);
        }
    }
    
    Logger.info(`Đã load ${client.commands.size} commands`);
    
    // Đăng ký commands lên Discord API khi bot ready
    client.once('ready', async () => {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const guildId = process.env.GUILD_ID;

        try {
            if (guildId) {
                // Đăng ký Guild Commands (đồng bộ tức thì, dùng để test)
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guildId),
                    { body: commands }
                );
                Logger.success(`Đã đăng ký ${commands.length} guild commands (instant) cho guild ${guildId}`);
            } else {
                // Đăng ký Global Commands (mất tới 1 giờ để đồng bộ)
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands }
                );
                Logger.success(`Đã đăng ký ${commands.length} global commands (có thể mất tới 1 giờ để hiển thị)`);
            }
        } catch (error) {
            Logger.error('Không thể đăng ký commands', error);
        }
    });
};
