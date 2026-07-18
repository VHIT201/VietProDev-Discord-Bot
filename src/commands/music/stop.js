const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Dừng phát nhạc và xóa hàng đợi'),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: '❌ Không có player nào đang hoạt động!', ephemeral: true });
        }

        player.queue.clear();
        await player.destroy();

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('⏹️ Đã dừng phát nhạc')
            .setDescription('Hàng đợi đã được xóa và bot đã rời voice channel.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
