const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { askAI } = require('../../services/aiService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Hỏi AI bất kỳ câu hỏi nào')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Câu hỏi của bạn (tối đa 2000 ký tự)')
                .setRequired(true)
                .setMaxLength(2000)
        ),
    
    async execute(interaction) {
        await interaction.deferReply();
        
        const question = interaction.options.getString('question');
        
        try {
            const response = await askAI(question, 30000);
            
            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('🤖 AI Response')
                .addFields(
                    { name: '❓ Câu hỏi', value: question, inline: false },
                    { name: '💬 Trả lời', value: response.substring(0, 4000), inline: false }
                )
                // .setFooter({ text: 'Powered by OpenRouter • Kimi AI' })
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ 
                content: `❌ ${error.message}`, 
                ephemeral: true 
            });
        }
    }
};
