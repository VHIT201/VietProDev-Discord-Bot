const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Xem thông tin của server hiện tại'),

    async execute(interaction) {
        const guild = interaction.guild;
        await guild.fetch();

        const totalMembers = guild.memberCount;
        const onlineMembers = guild.members.cache.filter(m => m.presence?.status !== 'offline').size;
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const roles = guild.roles.cache.size - 1;
        const boosts = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`🏠 ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🪪 ID', value: guild.id, inline: true },
                { name: '👑 Chủ server', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Ngày tạo', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Thành viên', value: `${totalMembers} (online: ~${onlineMembers})`, inline: true },
                { name: '💬 Kênh văn bản', value: `${textChannels}`, inline: true },
                { name: '🔊 Kênh thoại', value: `${voiceChannels}`, inline: true },
                { name: '🏷️ Vai trò', value: `${roles}`, inline: true },
                { name: '🚀 Server Boost', value: `${boosts} boost (Cấp ${guild.premiumTier})`, inline: true },
                { name: '🌐 Ngôn ngữ', value: guild.preferredLocale, inline: true },
            )
            .setTimestamp();

        if (guild.banner) {
            embed.setImage(guild.bannerURL({ size: 1024 }));
        }

        await interaction.reply({ embeds: [embed] });
    }
};
