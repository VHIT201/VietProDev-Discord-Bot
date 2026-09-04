const { SlashCommandBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');
const { createNowPlayingEmbed } = require('../../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Xem bài hát đang phát'),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || !player.queue.current) {
            return interaction.reply({ content: '❌ Không có bài nào đang phát!', ephemeral: true });
        }

        const embed = createNowPlayingEmbed(player.queue.current, player);
        await interaction.reply({ embeds: [embed] });
    }
};
