const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Xem danh sách tất cả các lệnh của bot'),

    async execute(interaction, client) {
        const commandList = {
            '🔧 Tiện ích': [
                '`/ping` - Kiểm tra độ trễ của bot',
                '`/help` - Xem danh sách lệnh',
                '`/userinfo` - Xem thông tin người dùng',
                '`/serverinfo` - Xem thông tin server',
                '`/avatar` - Xem ảnh đại diện',
                '`/weather` - Xem thời tiết',
                '`/datetime` - Xem ngày tháng & giờ',
                '`/ask` - Hỏi AI',
                '`/247` - Bot ở voice channel 24/7',
            ],
            '🎮 Vui vẻ': [
                '`/poll` - Tạo bình chọn',
                '`/dice` - Tung xúc xắc',
                '`/coinflip` - Tung đồng xu',
                '`/8ball` - Hỏi quả cầu ma thuật',
            ],
            '🛡️ Kiểm duyệt': [
                '`/kick` - Đuổi thành viên',
                '`/ban` - Cấm thành viên',
                '`/unban` - Bỏ cấm thành viên',
                '`/mute` - Im lặng thành viên',
                '`/unmute` - Bỏ im lặng thành viên',
                '`/warn` - Cảnh báo thành viên',
                '`/clear` - Xóa tin nhắn',
            ],
        };

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle('📖 Danh sách lệnh')
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: `Tổng: ${client.commands.size} lệnh` });

        for (const [category, commands] of Object.entries(commandList)) {
            embed.addFields({ name: category, value: commands.join('\n'), inline: false });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
