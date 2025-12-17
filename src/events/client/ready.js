const Logger = require('../../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        Logger.success(`Bot đã online: ${client.user.tag}`);
        Logger.info(`Đang phục vụ ${client.guilds.cache.size} servers với ${client.users.cache.size} users`);
        
        // Set bot activity
        client.user.setPresence({
            activities: [{ name: 'VietProDev Company', type: 3 }], // Type 3 = Watching
            status: 'online'
        });
    }
};
