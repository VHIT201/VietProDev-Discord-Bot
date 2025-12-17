/**
 * Cấu hình tĩnh của bot
 */
module.exports = {
    // Màu sắc Embed
    colors: {
        primary: 0x5865F2,    // Discord Blurple
        success: 0x57F287,    // Green
        warning: 0xFEE75C,    // Yellow
        error: 0xED4245,      // Red
        info: 0x3498db        // Blue
    },
    
    // IDs cố định (có thể override bằng .env)
    channels: {
        welcome: process.env.WELCOME_CHANNEL_ID || '',
        logs: process.env.LOG_CHANNEL_ID || '',
        general: process.env.GENERAL_CHANNEL_ID || ''
    },
    
    roles: {
        admin: process.env.ADMIN_ROLE_ID || '',
        moderator: process.env.MOD_ROLE_ID || '',
        member: process.env.MEMBER_ROLE_ID || ''
    },
    
    // Emoji
    emojis: {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        loading: '⏳',
        info: 'ℹ️'
    },
    
    // Giới hạn
    limits: {
        maxTicketsPerUser: 3,
        commandCooldown: 3000, // 3 giây
    },
    
    // Các thông điệp mặc định
    messages: {
        welcome: 'Chào mừng {user} đến với **VietProDev**! 🎉\nHãy đọc quy định và tận hưởng!',
        noPermission: 'Bạn không có quyền sử dụng lệnh này!',
        cooldown: 'Vui lòng đợi {time} giây trước khi dùng lại lệnh này.'
    }
};
