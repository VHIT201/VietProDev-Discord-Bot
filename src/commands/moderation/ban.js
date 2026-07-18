const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Cấm một thành viên khỏi server')
        .addUserOption(o => o.setName('user').setDescription('Thành viên cần cấm').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Lý do').setRequired(false))
        .addIntegerOption(o =>
            o.setName('delete_days')
                .setDescription('Số ngày tin nhắn cần xóa (0-7)')
                .setMinValue(0).setMaxValue(7).setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Không có lý do';
        const deleteDays = interaction.options.getInteger('delete_days') ?? 0;

        if (target && !target.bannable) return interaction.reply({ content: '❌ Tôi không thể cấm người này!', ephemeral: true });
        if (user.id === interaction.user.id) return interaction.reply({ content: '❌ Bạn không thể tự cấm mình!', ephemeral: true });

        await interaction.guild.members.ban(user.id, { reason, deleteMessageDays: deleteDays });

        const embed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('🔨 Đã cấm thành viên')
            .addFields(
                { name: 'Thành viên', value: `${user.tag} (${user.id})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Lý do', value: reason },
                { name: 'Xóa tin nhắn', value: `${deleteDays} ngày`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
