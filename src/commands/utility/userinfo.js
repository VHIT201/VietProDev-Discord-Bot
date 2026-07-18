const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Xem thông tin của một người dùng')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Người dùng muốn xem (mặc định là bạn)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id).catch(() => null);

        const roles = member
            ? member.roles.cache
                .filter(r => r.id !== interaction.guild.id)
                .sort((a, b) => b.position - a.position)
                .map(r => r.toString())
                .slice(0, 10)
                .join(', ') || 'Không có'
            : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(member?.displayHexColor || 0x5865F2)
            .setTitle(`👤 ${target.username}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                { name: '🪪 ID', value: target.id, inline: true },
                { name: '🤖 Bot', value: target.bot ? 'Có' : 'Không', inline: true },
                { name: '📅 Tạo tài khoản', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
            );

        if (member) {
            embed.addFields(
                { name: '📥 Tham gia server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '🎭 Biệt danh', value: member.nickname || 'Không có', inline: true },
                { name: `🏷️ Vai trò (${member.roles.cache.size - 1})`, value: roles, inline: false }
            );
        }

        embed.setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};
