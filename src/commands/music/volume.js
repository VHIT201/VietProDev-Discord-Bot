const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getKazagumo } = require('../../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Chỉnh âm lượng bot')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Mức âm lượng (0-100)')
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        ),

    async execute(interaction) {
        const kazagumo = getKazagumo();
        const player = kazagumo?.getPlayer(interaction.guild.id);

        if (!player) {
            return interaction.reply({ content: '❌ Không có player nào đang hoạt động!', ephemeral: true });
        }

        const level = interaction.options.getInteger('level');
        await player.setVolume(level);

        const embed = new EmbedBuilder()
            .setColor(0x1DB954)
            .setTitle('🔊 Âm lượng')
            .setDescription(`Đã đặt âm lượng thành **${level}%**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
