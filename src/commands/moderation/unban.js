const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bỏ cấm một người dùng')
        .addStringOption(o => o.setName('user_id').setDescription('ID của người dùng cần bỏ cấm').setRequired(true))
        .addStringOption(o => o.setName('reason').setDescription('Lý do').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'Không có lý do';

        const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
        if (!ban) return interaction.reply({ content: '❌ Người dùng này không bị cấm!', ephemeral: true });

        await interaction.guild.members.unban(userId, reason);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle('✅ Đã bỏ cấm thành viên')
            .addFields(
                { name: 'Thành viên', value: `${ban.user.tag} (${userId})`, inline: true },
                { name: 'Người thực hiện', value: interaction.user.tag, inline: true },
                { name: 'Lý do', value: reason }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
