const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Tung xúc xắc')
        .addIntegerOption(o =>
            o.setName('sides')
                .setDescription('Số mặt của xúc xắc (mặc định 6)')
                .setMinValue(2)
                .setMaxValue(100)
                .setRequired(false)
        )
        .addIntegerOption(o =>
            o.setName('count')
                .setDescription('Số lần tung (mặc định 1)')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(false)
        ),

    async execute(interaction) {
        const sides = interaction.options.getInteger('sides') || 6;
        const count = interaction.options.getInteger('count') || 1;

        const results = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const total = results.reduce((a, b) => a + b, 0);

        const embed = new EmbedBuilder()
            .setColor(0xFEE75C)
            .setTitle('🎲 Tung xúc xắc!')
            .addFields(
                { name: 'Kết quả', value: results.map(r => `**${r}**`).join(' + '), inline: true },
                { name: 'Tổng', value: `**${total}**`, inline: true },
                { name: 'Xúc xắc', value: `d${sides} × ${count}`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
