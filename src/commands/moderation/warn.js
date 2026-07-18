const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Cảnh báo một thành viên')
        .addUserOption(o => o.setName('user').setDescription('Thành viên cần cảnh báo').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Lý do cảnh báo').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const target = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');

        if (!target) return interaction.reply({ content: '❌ Không tìm thấy thành viên!', ephemeral: true });
        if (target.id === interaction.user.id) return interaction.reply({ content: '❌ Bạn không thể cảnh báo chính mình!', ephemeral: true });

        // Gửi DM cảnh báo cho thành viên
        const dmEmbed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle(`⚠️ Bạn đã bị cảnh báo tại ${interaction.guild.name}`)
            .addFields({ name: 'Lý do', value: reason })
            .setTimestamp();

        await target.user.send({ embeds: [dmEmbed] }).catch(() => null);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('⚠️ Đã cảnh báo thành viên')
            .addFields(
                { name: 'Thành viên', value: `${target.user.tag} (${target.id})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Lý do', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
