const { loadFiles } = require('../utils/fileLoader');
const Logger = require('../utils/logger');
const path = require('path');

/**
 * Handler cho Buttons, Select Menus, Modals
 */
module.exports = (client) => {
    const componentsPath = path.join(__dirname, '../components');
    
    // Load Buttons
    const buttonFiles = loadFiles(path.join(componentsPath, 'buttons'));
    for (const file of buttonFiles) {
        try {
            const button = require(file);
            if (button.id && button.execute) {
                client.buttons.set(button.id, button);
                Logger.debug(`Loaded button: ${button.id}`);
            }
        } catch (error) {
            Logger.error(`Lỗi load button ${file}`, error);
        }
    }
    
    // Load Select Menus
    const selectFiles = loadFiles(path.join(componentsPath, 'selectMenus'));
    for (const file of selectFiles) {
        try {
            const menu = require(file);
            if (menu.id && menu.execute) {
                client.selectMenus.set(menu.id, menu);
                Logger.debug(`Loaded select menu: ${menu.id}`);
            }
        } catch (error) {
            Logger.error(`Lỗi load select menu ${file}`, error);
        }
    }
    
    // Load Modals
    const modalFiles = loadFiles(path.join(componentsPath, 'modals'));
    for (const file of modalFiles) {
        try {
            const modal = require(file);
            if (modal.id && modal.execute) {
                client.modals.set(modal.id, modal);
                Logger.debug(`Loaded modal: ${modal.id}`);
            }
        } catch (error) {
            Logger.error(`Lỗi load modal ${file}`, error);
        }
    }
    
    Logger.info(`Đã load ${client.buttons.size} buttons, ${client.selectMenus.size} select menus, ${client.modals.size} modals`);
};
