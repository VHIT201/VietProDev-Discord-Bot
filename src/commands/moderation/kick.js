const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Đuổi một thành viên khỏi server')
        .addUserOption(o => o.setName('user').setDescription('Thành viên cần đuổi').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Lý do').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'Không có lý do';

        if (!target) return interaction.reply({ content: '❌ Không tìm thấy thành viên!', ephemeral: true });
        if (!target.kickable) return interaction.reply({ content: '❌ Tôi không thể đuổi người này!', ephemeral: true });
        if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Bạn không thể tự đuổi mình!', ephemeral: true });

        await target.kick(reason);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('👢 Đã đuổi thành viên')
            .addFields(
                { name: 'Thành viên', value: `${target.user.tag} (${target.id})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Lý do', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
