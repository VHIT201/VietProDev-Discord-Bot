const Logger = require('../../utils/logger');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message || !message.author || message.author.bot) return;
        
        // Bot trắng - không có logic nào
    }
};