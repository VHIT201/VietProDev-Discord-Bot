const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Xóa hàng loạt tin nhắn trong kênh')
        .addIntegerOption(o =>
            o.setName('amount')
                .setDescription('Số tin nhắn cần xóa (1-100)')
                .setMinValue(1).setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption(o =>
            o.setName('user')
                .setDescription('Chỉ xóa tin nhắn của người dùng này')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const filterUser = interaction.options.getUser('user');

        await interaction.deferReply({ ephemeral: true });

        let messages = await interaction.channel.messages.fetch({ limit: 100 });

        // Lọc tin nhắn cũ hơn 14 ngày (Discord không cho xóa bulk)
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
        messages = messages.filter(m => m.createdTimestamp > twoWeeksAgo);

        if (filterUser) {
            messages = messages.filter(m => m.author.id === filterUser.id);
        }

        const toDelete = messages.first(amount);
        if (toDelete.length === 0) {
            return interaction.editReply('❌ Không tìm thấy tin nhắn nào có thể xóa!');
        }

        const deleted = await interaction.channel.bulkDelete(toDelete, true);

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setDescription(`✅ Đã xóa **${deleted.size}** tin nhắn${filterUser ? ` của ${filterUser.tag}` : ''}.`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
