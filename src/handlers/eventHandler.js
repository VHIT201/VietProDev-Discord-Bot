const { loadFiles } = require('../utils/fileLoader');
const Logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

/**
 * Handler tự động load Events
 */
module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = loadFiles(eventsPath);
    
    for (const file of eventFiles) {
        try {
            const event = require(file);
            
            if (!event.name || !event.execute) {
                Logger.warn(`File ${file} thiếu property 'name' hoặc 'execute'`);
                continue;
            }
            
            // Bind event
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
            
            Logger.debug(`Loaded event: ${event.name}`);
        } catch (error) {
            Logger.error(`Lỗi khi load event ${file}`, error);
        }
    }
    
    Logger.info(`Đã load ${eventFiles.length} events`);
};
