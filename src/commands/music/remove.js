const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Xóa một bài khỏi hàng đợi')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Vị trí bài cần xóa (xem trong /queue)')
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || player.queue.length === 0) {
            return interaction.reply({ content: '❌ Hàng đợi trống!', ephemeral: true });
        }

        const position = interaction.options.getInteger('position');

        if (position > player.queue.length) {
            return interaction.reply({ content: `❌ Vị trí không hợp lệ! Hàng đợi chỉ có ${player.queue.length} bài.`, ephemeral: true });
        }

        const removed = player.queue.splice(position - 1, 1)[0];

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🗑️ Đã xóa khỏi hàng đợi')
            .setDescription(`**[${removed.title}](${removed.uri || 'https://example.com'})**`)
            .addFields(
                { name: '👤 Nghệ sĩ', value: removed.author || 'Unknown', inline: true },
                { name: '📍 Vị trí', value: `${position}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
