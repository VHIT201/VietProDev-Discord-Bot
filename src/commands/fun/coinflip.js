const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Tung đồng xu ngẫu nhiên'),

    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Mặt ngửa 🌕' : 'Mặt sấp 🌑';

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🪙 Tung đồng xu!')
            .setDescription(`Kết quả: **${result}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
