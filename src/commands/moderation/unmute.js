const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Bỏ im lặng một thành viên')
        .addUserOption(o => o.setName('user').setDescription('Thành viên cần bỏ im lặng').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Lý do').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'Không có lý do';

        if (!target) return interaction.reply({ content: '❌ Không tìm thấy thành viên!', ephemeral: true });
        if (!target.isCommunicationDisabled()) return interaction.reply({ content: '❌ Thành viên này không bị im lặng!', ephemeral: true });

        await target.timeout(null, reason);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('🔊 Đã bỏ im lặng thành viên')
            .addFields(
                { name: 'Thành viên', value: `${target.user.tag} (${target.id})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Lý do', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
