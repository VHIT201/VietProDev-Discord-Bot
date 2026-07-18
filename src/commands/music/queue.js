const { SlashCommandBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');
const { createQueueEmbed } = require('../../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Xem hàng đợi nhạc')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Trang (mỗi trang 10 bài)')
                .setMinValue(1)
                .setRequired(false)
        ),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || (player.queue.length === 0 && !player.queue.current)) {
            return interaction.reply({ content: '❌ Hàng đợi trống!', ephemeral: true });
        }

        const page = (interaction.options.getInteger('page') || 1) - 1;
        const embed = createQueueEmbed(player, page);

        await interaction.reply({ embeds: [embed] });
    }
};
