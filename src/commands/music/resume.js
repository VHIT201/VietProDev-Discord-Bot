const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Tiếp tục phát nhạc sau khi tạm dừng'),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || !player.paused) {
            return interaction.reply({ content: '❌ Nhạc không bị tạm dừng!', ephemeral: true });
        }

        await player.resume();

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('▶️ Đã tiếp tục phát')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
