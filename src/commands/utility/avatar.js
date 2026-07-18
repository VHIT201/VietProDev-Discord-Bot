const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Xem ảnh đại diện của người dùng')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Người dùng muốn xem (mặc định là bạn)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user') || interaction.user;

        const formats = ['webp', 'png', 'jpg'].map(f =>
            `[${f.toUpperCase()}](${target.displayAvatarURL({ extension: f, size: 1024 })})`
        ).join(' • ');

        const embed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`🖼️ Avatar của ${target.username}`)
            .setImage(target.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(formats)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
