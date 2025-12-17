const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uonggi')
        .setDescription('Gợi ý đồ uống ngẫu nhiên'),
    
    async execute(interaction) {
        const drinks = [
            'Trà đá',
            'Trà sữa trân châu',
            'Cà phê sữa',
            'Sinh tố bơ',
            'Nước mía',
            'Nước chanh leo',
            'Soda chanh',
            'Matcha latte',
            'Sữa đậu nành'
        ];
        
        const pick = drinks[Math.floor(Math.random() * drinks.length)];
        await interaction.reply(`🥤 Gợi ý đồ uống: **${pick}**`);
    }
};
