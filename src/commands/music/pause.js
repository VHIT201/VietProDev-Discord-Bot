const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Tạm dừng phát nhạc'),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || !player.playing) {
            return interaction.reply({ content: '❌ Không có bài nào đang phát!', ephemeral: true });
        }

        await player.pause();

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('⏸️ Đã tạm dừng')
            .setDescription('Dùng `/resume` để tiếp tục phát.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
