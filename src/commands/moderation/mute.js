const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const DURATION_MAP = {
    '60': 60 * 1000,
    '300': 5 * 60 * 1000,
    '600': 10 * 60 * 1000,
    '1800': 30 * 60 * 1000,
    '3600': 60 * 60 * 1000,
    '86400': 24 * 60 * 60 * 1000,
    '604800': 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Im lặng một thành viên (timeout)')
        .addUserOption(o => o.setName('user').setDescription('Thành viên cần im lặng').setRequired(true))
        .addStringOption(o =>
            o.setName('duration')
                .setDescription('Thời gian im lặng')
                .setRequired(true)
                .addChoices(
                    { name: '1 phút', value: '60' },
                    { name: '5 phút', value: '300' },
                    { name: '10 phút', value: '600' },
                    { name: '30 phút', value: '1800' },
                    { name: '1 giờ', value: '3600' },
                    { name: '1 ngày', value: '86400' },
                    { name: '1 tuần', value: '604800' },
                )
        )
        .addStringOption(o => o.setName('reason').setDescription('Lý do').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const durationKey = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'Không có lý do';
        const durationMs = DURATION_MAP[durationKey];

        if (!target) return interaction.reply({ content: '❌ Không tìm thấy thành viên!', ephemeral: true });
        if (!target.moderatable) return interaction.reply({ content: '❌ Tôi không thể im lặng người này!', ephemeral: true });

        await target.timeout(durationMs, reason);

        const untilTimestamp = Math.floor((Date.now() + durationMs) / 1000);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🔇 Đã im lặng thành viên')
            .addFields(
                { name: 'Thành viên', value: `${target.user.tag} (${target.id})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Hết hạn', value: `<t:${untilTimestamp}:R>`, inline: true },
                { name: 'Lý do', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
