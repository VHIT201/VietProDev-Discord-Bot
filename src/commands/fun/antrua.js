const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antrua')
        .setDescription('Gợi ý món ăn trưa ngẫu nhiên'),
    
    async execute(interaction) {
        const lunch = [
            'Cơm gà',
            'Cơm sườn',
            'Bún mắm',
            'Cơm tấm',
            'Phở',
            'Mì quảng',
            'Bún bò Huế',
            'Cơm gà xối mỡ',
            'Canh chua + cá chiên'
        ];
        
        const pick = lunch[Math.floor(Math.random() * lunch.length)];
        await interaction.reply(`🍚 Gợi ý ăn trưa: **${pick}**`);
    }
};
