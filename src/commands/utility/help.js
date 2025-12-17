const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../configs/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiển thị danh sách lệnh có sẵn'),
    
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(config.colors.info)
            .setTitle('📚 Danh sách lệnh VietProDev Bot')
            .setDescription('Dưới đây là tất cả các lệnh bạn có thể sử dụng:')
            .addFields(
                { 
                    name: '🛠️ Tiện ích', 
                    value: '`/ping` - Kiểm tra độ trễ\n`/help` - Hiển thị menu này' 
                },
                { 
                    name: '🎮 Giải trí', 
                    value: '`/rps` - Chơi Kéo-Búa-Bao\n`/ansang` - Gợi ý ăn sáng\n`/antrua` - Gợi ý ăn trưa\n`/uonggi` - Gợi ý đồ uống' 
                },
                { 
                    name: '🌤️ Khác', 
                    value: '`/weather` - Xem thời tiết' 
                }
            )
            .setFooter({ text: 'VietProDev Bot • Made with ❤️' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
