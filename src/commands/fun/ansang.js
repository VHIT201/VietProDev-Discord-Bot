const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ansang')
        .setDescription('Gợi ý món ăn sáng ngẫu nhiên'),
    
    async execute(interaction) {
        const breakfast = [
            'Phở bò',
            'Bún riêu',
            'Bánh mì ốp la',
            'Xôi gà',
            'Bánh cuốn',
            'Cháo sườn',
            'Hủ tiếu',
            'Bún chả',
            'Mì xào'
        ];
        
        const pick = breakfast[Math.floor(Math.random() * breakfast.length)];
        await interaction.reply(`🍜 Gợi ý ăn sáng: **${pick}**`);
    }
};
