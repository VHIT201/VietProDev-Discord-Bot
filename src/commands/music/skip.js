const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');
const { formatDuration } = require('../../utils/musicUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Bỏ qua bài hát hiện tại')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Số bài muốn bỏ qua (mặc định: 1)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(false)
        ),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player || !player.playing) {
            return interaction.reply({ content: '❌ Không có bài nào đang phát!', ephemeral: true });
        }

        const count = interaction.options.getInteger('count') || 1;

        if (count > 1) {
            player.queue.splice(0, count - 1);
        }

        const skipped = player.queue.current;
        await player.skip();

        const embed = new EmbedBuilder()
            .setColor(0x1DB954)
            .setTitle('⏭️ Đã bỏ qua')
            .setDescription(`**[${skipped?.title || 'Unknown'}](${skipped?.uri || 'https://example.com'})**`)
            .addFields(
                { name: '⏭️ Số bài bỏ qua', value: `${count}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
