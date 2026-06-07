const { EmbedBuilder } = require('discord.js');

function createMorningReminder() {
    const embed = new EmbedBuilder()
        .setColor(0x00D26A)
        .setTitle('☀️ Chào buổi sáng!')
        .setDescription('@everyone Chúc mọi người một ngày làm việc tuyệt vời, năng suất và di chuyển cẩn thận nhé!')
        .setFooter({ text: 'Bot' })
        .setTimestamp();
    return { embed, content: '@everyone' };
}

function createWaterReminder() {
    const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle('💧 Nhắc nhở uống nước')
        .setDescription('@everyone Đã 9:00 sáng rồi, mọi người nhớ uống nước để giữ sức khỏe nhé!')
        .setFooter({ text: 'Bot' })
        .setTimestamp();
    return { embed, content: '@everyone' };
}

function createLunchReminder() {
    const embed = new EmbedBuilder()
        .setColor(0xFF9500)
        .setTitle('🍽️ Đã 11:30')
        .setDescription('@everyone Chúc mọi người ăn trưa ngon miệng!')
        .setFooter({ text: 'Bot' })
        .setTimestamp();
    return { embed, content: '@everyone' };
}

function createEveningReminder() {
    const embed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('🌅 Đã 17:00')
        .setDescription('@everyone mọi người về cẩn thậnnnnnnnnnnnnnn')
        .setFooter({ text: 'Bot' })
        .setTimestamp();
    return { embed, content: '@everyone' };
}

module.exports = {
    createMorningReminder,
    createWaterReminder,
    createLunchReminder,
    createEveningReminder
};
