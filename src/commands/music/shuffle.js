const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Xáo trộn hàng đợi'),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || player.queue.length === 0) {
            return interaction.reply({ content: '❌ Hàng đợi trống!', ephemeral: true });
        }

        player.queue.shuffle();

        const embed = new EmbedBuilder()
            .setColor(0x1DB954)
            .setTitle('🔀 Đã xáo trộn hàng đợi')
            .setDescription(`${player.queue.length} bài đã được xáo trộn.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
