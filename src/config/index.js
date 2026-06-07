/**
 * Config hợp nhất + Validation .env
 * Đảm bảo các biến môi trường cần thiết có mặt trước khi chạy bot
 */

require('dotenv').config();
const staticConfig = require('../configs/config');

// Validate các biến môi trường bắt buộc
const REQUIRED_ENV_VARS = ['DISCORD_TOKEN'];
const OPTIONAL_ENV_VARS = ['DISCORD_APP_ID', 'DISCORD_PUBLIC_KEY', 'MONGO_URI'];

function validateEnv() {
    const missing = [];
    
    for (const envVar of REQUIRED_ENV_VARS) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }
    
    if (missing.length > 0) {
        throw new Error(`❌ Thiếu các biến môi trường bắt buộc trong .env: ${missing.join(', ')}`);
    }
}

// Gọi validation ngay khi import
validateEnv();

const config = {
    ...staticConfig,
    
    // Discord credentials (bắt buộc)
    token: process.env.DISCORD_TOKEN,
    appId: process.env.DISCORD_APP_ID || '',
    publicKey: process.env.DISCORD_PUBLIC_KEY || '',
    
    // MongoDB
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/discord-bot',
    
    // Debug mode
    debug: process.env.DEBUG === 'true',
    
    // Override channels/roles từ .env nếu có
    channels: {
        welcome: process.env.WELCOME_CHANNEL_ID || staticConfig.channels.welcome,
        logs: process.env.LOG_CHANNEL_ID || staticConfig.channels.logs,
        general: process.env.GENERAL_CHANNEL_ID || staticConfig.channels.general,
        tmsCheckin: process.env.TMS_CHECKIN_CHANNEL_ID || staticConfig.channels.tmsCheckin
    },
    
    roles: {
        admin: process.env.ADMIN_ROLE_ID || staticConfig.roles.admin,
        moderator: process.env.MOD_ROLE_ID || staticConfig.roles.moderator,
        member: process.env.MEMBER_ROLE_ID || staticConfig.roles.member
    }
};

module.exports = config;
