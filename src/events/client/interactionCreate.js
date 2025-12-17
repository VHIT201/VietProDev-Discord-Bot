const Logger = require('../../utils/logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Xử lý Slash Commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            
            if (!command) {
                Logger.warn(`Command ${interaction.commandName} không tồn tại`);
                return;
            }
            
            try {
                Logger.command(interaction.commandName, interaction.user.tag);
                await command.execute(interaction, client);
            } catch (error) {
                Logger.error(`Lỗi thực thi command ${interaction.commandName}`, error);
                
                const errorMessage = {
                    content: '❌ Đã có lỗi xảy ra khi thực thi lệnh này!',
                    ephemeral: true
                };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }
        
        // Xử lý Buttons
        else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            
            if (!button) {
                Logger.warn(`Button ${interaction.customId} không tồn tại`);
                return;
            }
            
            try {
                await button.execute(interaction, client);
            } catch (error) {
                Logger.error(`Lỗi xử lý button ${interaction.customId}`, error);
            }
        }
        
        // Xử lý Select Menus
        else if (interaction.isStringSelectMenu()) {
            const menu = client.selectMenus.get(interaction.customId);
            
            if (!menu) {
                Logger.warn(`Select menu ${interaction.customId} không tồn tại`);
                return;
            }
            
            try {
                await menu.execute(interaction, client);
            } catch (error) {
                Logger.error(`Lỗi xử lý select menu ${interaction.customId}`, error);
            }
        }
        
        // Xử lý Modals
        else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            
            if (!modal) {
                Logger.warn(`Modal ${interaction.customId} không tồn tại`);
                return;
            }
            
            try {
                await modal.execute(interaction, client);
            } catch (error) {
                Logger.error(`Lỗi xử lý modal ${interaction.customId}`, error);
            }
        }
    }
};
